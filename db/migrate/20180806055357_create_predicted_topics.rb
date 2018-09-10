class CreatePredictedTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :predicted_topics do |t|

      t.timestamps
    end
  end
end
