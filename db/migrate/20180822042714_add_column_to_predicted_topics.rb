class AddColumnToPredictedTopics < ActiveRecord::Migration[5.2]
  def change
    add_reference :predicted_topics, :dataset, foreign_key: true
    add_column :predicted_topics, :docid, :integer
    add_column :predicted_topics, :topic1, :integer
    add_column :predicted_topics, :proba1, :decimal, precision: 9, scale: 6
  end
end
