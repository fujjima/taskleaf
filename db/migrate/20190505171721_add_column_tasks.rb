class AddColumnTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :finished_at, :datetime
  end
end
