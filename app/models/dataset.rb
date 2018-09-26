DEFAULT_TD_CONSOLE_PATH = "https://console.treasuredata.com"

class Dataset < ApplicationRecord
  has_many :topics
  has_many :lda_models
  has_many :predicted_topics

  scope :visible_by, -> (user) do
    where(td_account_id: user.td_account_id)
  end

  def workflow_detail_url_on_td
    "#{td_console_path}/app/workflows/#{self.workflow_id}/info"
  end

  def session_detail_url_on_td
    "#{td_console_path}/app/workflows/#{self.workflow_id}/sessions/#{self.session_id}"
  end

  def fetch_status
    Rails.cache.read("/datasets/#{self.id}/fetch_status")
  end

  private
  def td_console_path
    ENV["TD_CONSOLE"].nil? ? DEFAULT_TD_CONSOLE_PATH : ENV["TD_CONSOLE"]
  end
end
