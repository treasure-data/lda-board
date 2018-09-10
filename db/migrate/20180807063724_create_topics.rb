class CreateTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :topics do |t|
      t.decimal :x, precision: 9, scale: 6
      t.decimal :y, precision: 9, scale: 6
      t.decimal :frequency, precision: 9, scale: 6
      t.belongs_to :dataset, foreign_key: true

      t.timestamps
    end
  end
end
