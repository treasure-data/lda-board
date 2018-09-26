DEFAULT_TD_API_SERVER = "https://api.treasuredata.com"
DEFAULT_TD_WORKFLOW_SERVER = "https://api-workflow.treasuredata.com"

class TdClient
  def initialize(apikey)
    @apikey = apikey
  end

  def api
    api_host = ENV["TD_API_SERVER"].nil? ? DEFAULT_TD_API_SERVER : ENV["TD_API_SERVER"]
    TdApiClient.new(create_faraday_client(api_host))
  end

  def workflow
    api_host = ENV["TD_WORKFLOW_SERVER"].nil? ? DEFAULT_TD_WORKFLOW_SERVER : ENV["TD_WORKFLOW_SERVER"]
    TdWorkflowClient.new(create_faraday_client(api_host))
  end

  private
  
  def create_faraday_client(url)
    client = Faraday.new(url: url) do |faraday|
      faraday.headers['Authorization'] = "TD1 #{@apikey}"
      faraday.response :logger, @logger, bodies: true
      faraday.headers['Content-Type'] = 'application/json'
      faraday.adapter  Faraday.default_adapter
    end

    return client
  end
end
