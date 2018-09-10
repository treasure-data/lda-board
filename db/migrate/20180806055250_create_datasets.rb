class CreateDatasets < ActiveRecord::Migration[5.2]
  def change
    create_table :datasets do |t|

      t.timestamps
    end
  end
end
