class ChangeTasksColumns < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :elapsed_time, :time
    add_column :tasks, :elapsed_time, :integer
  end
end
