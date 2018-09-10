class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.integer :td_user_id
      t.timestamps
    end
  end
end
