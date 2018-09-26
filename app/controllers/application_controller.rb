class ApplicationController < ActionController::API
  before_action :authenticate

  def authenticate
    unless request.headers["authorization"].present? && request.headers["authorization"].start_with?("TD1")
      render status: 401
    end

    auth_headers = {
      authorization: request.headers["authorization"],
    }

    auth_params = {
      ipaddr: request.remote_ip,
    }

    api_key = auth_headers[:authorization].split(/ +/)[1]

    td_user = fetch_td_user_by_headers(auth_headers, auth_params)

    user = User.find_or_create_by!(td_user_id: td_user[:id]) do |user|
      user.td_user_id = td_user[:id]
      user.td_account_id = td_user[:account_id]
      user.td_api_key = api_key
    end

    user.td_api_key = api_key
    user.save!

    @current_user = user
  end

  def current_user
    @current_user
  end

  private

  def fetch_td_user_by_headers(auth_headers, auth_params)
    cache_key = "td_user:auth/#{Digest::SHA256.hexdigest(auth_headers.merge(auth_params).to_json)}"

    td_user = Rails.cache.fetch(cache_key, expires_in: 10.minutes) do
      authenticate_by_headers(auth_headers, auth_params)
    end

    if td_user.nil?
      Rails.cache.delete cache_key
      td_user = authenticate_by_headers(auth_headers, auth_params)
    end

    return td_user
  end

  def authenticate_by_headers(auth_headers, auth_params)
    td_api = TdClient.new(auth_headers[:authorization].split(/ +/)[1]).api
    user = td_api.get_user_show
    account = td_api.get_account_show
    {
      id: user["id"],
      account_id: account["account"]["id"]
    }
  end
end
