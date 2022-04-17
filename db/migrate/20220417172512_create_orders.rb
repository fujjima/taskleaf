class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.references :task, null: false, foreign_key: true
      t.references :list, null: false, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
