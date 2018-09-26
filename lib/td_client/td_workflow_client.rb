class TdClient
  class TdWorkflowClient
    def initialize(faraday)
      @faraday = faraday
    end

    def get_workflows
      response = @faraday.get "/api/workflows?count=4000"
      return JSON.parse(response.body)['workflows'] || []
    end

    def get_session_status(session_id:)
      response = @faraday.get "/api/sessions/#{session_id}"
      return JSON.parse(response.body)['lastAttempt'] || {}
    end

    def start_workflow(workflow_id: , session_time: Time.now.utc, session_params: {})
      response = @faraday.put "/api/attempts" do |req|
        req.body = {
          workflowId: workflow_id,
          sessionTime: session_time.is_a?(String) ? session_time : session_time.iso8601,
          params: session_params,
        }.to_json
      end

      return JSON.parse(response.body)
    end

    def get_tasks(attempt_id:)
      response = @faraday.get "/api/attempts/#{attempt_id}/tasks"
      return JSON.parse(response.body)['tasks'] || []
    end
  end
end
