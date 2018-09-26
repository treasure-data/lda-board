class TdClient
  class TdApiClient
    def initialize(faraday)
      @faraday = faraday
    end

    def get_user_show
      response = @faraday.get "/v3/user/show"
      return JSON.parse(response.body)
    end

    def get_account_show
      response = @faraday.get "/v3/account/show"
      return JSON.parse(response.body)
    end
  end
end
