class AddColumnsToDataset < ActiveRecord::Migration[5.2]
  def change
    add_column :datasets, :workflow_id, :integer
    add_column :datasets, :attempt_id, :integer
    add_column :datasets, :session_id, :integer
  end
end
