class Api::V1::DatasetsController < ApplicationController
  def index
    @datasets = Dataset.visible_by(current_user).reverse_order
    render json: {
      datasets: @datasets,
    }, methods: [:workflow_detail_url_on_td, :session_detail_url_on_td, :fetch_status]
  end

  def create
    wf_api = TdClient.new(current_user.td_api_key).workflow
    workflow_result = wf_api.start_workflow(workflow_id: params[:workflow_id], session_params: params[:session_params])

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
    force = ActiveRecord::Type::Boolean.new.cast(params[:force])
    session_status = get_session_status(session_id: dataset.session_id, force: force)
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
    wf_api = TdClient.new(current_user.td_api_key).workflow
    @workflows = wf_api.get_workflows
    render json: {
      workflows: @workflows
    }
  end

  private

  def dataset_params
    params.permit(:workflow_id)
  end

  def get_session_status(session_id:, force:)
    cache_key = "/api/sessions/#{session_id}"
    Rails.cache.fetch(cache_key, expires_in: 30.days, force: force) do
      wf_api = TdClient.new(current_user.td_api_key).workflow
      wf_api.get_session_status(session_id: session_id)
    end
  end
end
