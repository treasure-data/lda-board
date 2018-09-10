class AddColumnsToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :td_account_id, :integer

    add_index :users, :td_user_id
  end
end
