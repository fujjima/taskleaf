class AddElapsedTimeToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :elapsed_time, :time
  end
end
