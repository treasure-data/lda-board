class AddColumnToTopic < ActiveRecord::Migration[5.2]
  def change
    add_column :topics, :topic_id, :integer
  end
end
