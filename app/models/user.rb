class User < ApplicationRecord
  attr_accessor :td_api_key
  validates :td_api_key, presence: true
end
