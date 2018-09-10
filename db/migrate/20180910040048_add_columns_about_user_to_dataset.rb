class AddColumnsAboutUserToDataset < ActiveRecord::Migration[5.2]
  def change
    add_column :datasets, :td_account_id, :integer
    add_column :datasets, :td_user_id, :integer

    add_index :datasets, :td_account_id
    add_index :datasets, :td_user_id
  end
end
