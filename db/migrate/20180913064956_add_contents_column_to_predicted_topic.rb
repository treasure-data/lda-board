class AddContentsColumnToPredictedTopic < ActiveRecord::Migration[5.2]
  def change
    add_column :predicted_topics, :contents, :jsonb
  end
end
