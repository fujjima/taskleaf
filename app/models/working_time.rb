class WorkingTime < ApplicationRecord
  belongs_to :task

  class << self
    def working_time_with_task_id_hash
      WorkingTime.all.group_by(&:task_id).each_with_object({}) do |(task_id, working_times), hash|
        sum_working_times = working_times.sum { |wt| sum_working_time_per_task(wt) }
        hash[task_id] = sum_working_times
        hash
      end
    end

    # XXX: timesの合計を取得する（working_timeのインスタンスを必要としているのが微妙）
    def sum_working_time_per_task(working_time)
      working_time&.times&.sum { |time| (Time.parse(time['end_at']) - Time.parse(time['start_at'])).to_i }
    end
  end
end
