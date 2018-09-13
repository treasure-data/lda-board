class Api::V1::DatasetsController < ApplicationController
  def index
    @datasets = Dataset.visible_by(current_user).reverse_order
    render json: {
      datasets: @datasets,
    }, methods: [:workflow_detail_url_on_td, :session_detail_url_on_td, :fetch_status]
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
      .map { |k, v| v }

    topics = Topic.where(dataset_id: params[:id])

    predictedTopics = PredictedTopic
      .select("id, docid, topic1, proba1, contents")
      .where(dataset_id: params[:id])
      .order(:topic1, {proba1: 'desc'})
      .group_by {|item| item.topic1 }
      .map { |k, v| v }

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
    current_dataset = Dataset.find(params[:dataset_id])

    if current_dataset.fetch_status == "working"
      status = "already running"
    else
      FetchResultFromTdJob.perform_later(
        current_user.td_api_key,
        current_dataset,
      )
      status = "started"
    end

    render json: { status: status }    
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

     Rails.cache.fetch(url, expires_in: 10.minutes) do
      conn = Faraday.new
      res = conn.get url do |req|
        req.headers['Authorization'] = "TD1 #{current_user.td_api_key}"
        req.headers['Content-Type'] = 'application/json'
      end
      JSON.parse(res.body)['lastAttempt'] || {}
    end
  end
end
