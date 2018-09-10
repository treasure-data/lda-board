class SpaController < ActionController::Base
  protect_from_forgery except: :index
  layout 'application'

  def index
  end
end
