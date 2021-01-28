class ChangeTotalTimesWorkingTimes < ActiveRecord::Migration[5.2]
  def change
    rename_table :total_times, :working_times
  end
end
