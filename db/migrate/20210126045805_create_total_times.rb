class CreateTotalTimes < ActiveRecord::Migration[5.2]
  def up
    create_table :total_times do |t|
      t.date :recorded_at, null: false
      t.jsonb :times, default: []
      t.references :task, foreign_key: true
      t.timestamps
    end
    add_index :total_times, :times, using: 'gin'
  end

  def down
    remove_index :total_times, :times
    drop_table :total_times do |t|
      t.date :recorded_at, null: false
      t.jsonb :times, default: []
      t.references :task, foreign_key: true
      t.timestamps
    end
  end
end
