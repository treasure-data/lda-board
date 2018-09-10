class ChangeColumnTypePredictedTopic < ActiveRecord::Migration[5.2]
  def change
    change_column :predicted_topics, :docid, :string
  end
end
