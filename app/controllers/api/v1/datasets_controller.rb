class Api::V1::DatasetsController < ApplicationController
  def index
    @datasets = Dataset.visible_by(current_user).reverse_order
    render json: {
      datasets: @datasets,
    }, methods: [:workflow_detail_url_on_td, :session_detail_url_on_td]
  end

  def create
    workflow_result = start_workflow(workflow_id: params[:workflow_id], session_params: params[:session_params])

    @dataset = Dataset.create(
      td_user_id: current_user.td_user_id,
      td_account_id: current_user.td_account_id,
      workflow_id: params[:workflow_id],
      attempt_id: workflow_result["id"],
      session_id: workflow_result["sessionId"],
    )

    render json: @dataset
  end

  def show
    ldaModel = LdaModel
      .select("id, label, word, lambda")
      .where(dataset_id: params[:id])
      .order(:label, {lambda: 'desc'})
      .group_by {|item| item.label }
      .map { |k, v| v.first(20) }

    topics = Topic.where(dataset_id: params[:id])

    predictedTopics = PredictedTopic
      .select("id, docid, topic1, proba1")
      .where(dataset_id: params[:id])
      .order(:topic1, {proba1: 'desc'})
      .group_by {|item| item.topic1 }
      .map { |k, v| v.first(20) }

    render json: {
      ldaModel: ldaModel,
      topics: topics,
      predictedTopics: predictedTopics,
    }
  end

  def status
    dataset = Dataset.find(params[:dataset_id])
    session_status = get_session_status(session_id: dataset.session_id)
    render json: session_status
  end

  def fetch
    dataset = Dataset.find(params[:dataset_id])
    client = TreasureData::Client.new(current_user.td_api_key, {
      endpoint: ENV["TD_API_SERVER"],
      type: :presto
    })

    tasks = get_tasks(attempt_id: dataset.attempt_id)
    parentTask = tasks.select {|t| t['parentId'].nil?}
    dbname = parentTask.first['config']['_export']['dbname']

    # fetch lda_model
    job = client.query(dbname, "select label, word, lambda from #{dataset.session_id}_lda_model")
    until job.finished?
      sleep 2
      job.update_progress!
    end
    job.update_status!
    
    dataset.lda_models.delete_all
    lda_models = []
    job.result_each do |row|
      lda_models << dataset.lda_models.new(
        label: row[0],
        word: row[1],
        lambda: row[2],
      )
    end

    lda_models.each_slice(5000) do |lda_models_sub|
      dataset.lda_models.import(lda_models_sub)
    end

    # fetch principal_component
    job = client.query(dbname, "SELECT index, x, y, proportion FROM #{dataset.session_id}_principal_component join #{dataset.session_id}_topic_proportion on (#{dataset.session_id}_principal_component.index = #{dataset.session_id}_topic_proportion.topic)")
    until job.finished?
      sleep 2
      job.update_progress!
    end
    job.update_status!
    dataset.topics.delete_all
    topics = []

    job.result_each do |row|
      topics << dataset.topics.new(x: row[1], y: row[2], topic_id: row[0], frequency: row[3])
    end

    dataset.topics.import(topics)

    # fetch predicted_topics
    job = client.query(dbname, "SELECT docid, topic1, proba1 FROM #{dataset.session_id}_predicted_topics")
    until job.finished?
      sleep 2
      job.update_progress!
    end
    job.update_status!
    dataset.predicted_topics.delete_all
    predicted_topics = []
    job.result_each do |row|
      predicted_topics << dataset.predicted_topics.new(
        docid: row[0],
        topic1: row[1],
        proba1: row[2],
      )
    end

    predicted_topics.each_slice(5000) do |predicted_topics_sub|
      dataset.predicted_topics.import(predicted_topics_sub)
    end

    dataset.touch
    dataset.save

    render json: { status: 'success' }
  end

  def workflows
    @workflows = get_workflows
    render json: {
      workflows: @workflows
    }
  end

  private

  def dataset_params
    params.permit(:workflow_id)
  end

  def get_workflows
    conn = Faraday.new
    res = conn.get "#{ENV["TD_WORKFLOW_SERVER"]}/api/workflows?count=4000" do |req|
      req.headers['Authorization'] = "TD1 #{current_user.td_api_key}"
      req.headers['Content-Type'] = 'application/json'
    end

    JSON.parse(res.body)['workflows'] || []
  end

  def get_tasks(attempt_id:)
    conn = Faraday.new
    res = conn.get "#{ENV["TD_WORKFLOW_SERVER"]}/api/attempts/#{attempt_id}/tasks" do |req|
      req.headers['Authorization'] = "TD1 #{current_user.td_api_key}"
      req.headers['Content-Type'] = 'application/json'
    end

    JSON.parse(res.body)['tasks'] || []
  end

  def start_workflow(workflow_id: , session_time: Time.now.utc, session_params: {})
    conn = Faraday.new
    res = conn.put "#{ENV["TD_WORKFLOW_SERVER"]}/api/attempts" do |req|
      req.headers['Authorization'] = "TD1 #{current_user.td_api_key}"
      req.headers['Content-Type'] = 'application/json'
      req.body = {
        workflowId: workflow_id,
        sessionTime: session_time.is_a?(String) ? session_time : session_time.iso8601,
        params: session_params,
      }.to_json
    end

    JSON.parse(res.body)
  end

  def get_session_status(session_id:)
    url = "#{ENV["TD_WORKFLOW_SERVER"]}/api/sessions/#{session_id}"

     Rails.cache.fetch(url, expires_in: 1.minutes) do
      conn = Faraday.new
      res = conn.get url do |req|
        req.headers['Authorization'] = "TD1 #{current_user.td_api_key}"
        req.headers['Content-Type'] = 'application/json'
      end

      JSON.parse(res.body)['lastAttempt'] || {}
    end
  end
end
