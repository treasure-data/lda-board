class CreateLdaModels < ActiveRecord::Migration[5.2]
  def change
    create_table :lda_models do |t|

      t.timestamps
    end
  end
end
