class RemoveElapsedTimeFromTasks < ActiveRecord::Migration[5.2]
  def up
    remove_column :tasks, :elapsed_time
  end

  def down
    remove_column :tasks, :elapsed_time, :integer
  end
end
