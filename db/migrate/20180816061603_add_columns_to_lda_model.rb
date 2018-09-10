class AddColumnsToLdaModel < ActiveRecord::Migration[5.2]
  def change
    add_reference :lda_models, :dataset, foreign_key: true
    add_column :lda_models, :label, :integer
    add_column :lda_models, :word, :string
    add_column :lda_models, :lambda, :decimal, precision: 9, scale: 6
  end
end
