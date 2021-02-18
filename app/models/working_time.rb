# -------------------------------------------------
# WorkintTime
# 
# 各タスクに紐づく作業時間を管理する
# 
# recorded_at: 記録がされた日
# times: ある日における作業時間の開始時刻及び終了時刻の配列
# -------------------------------------------------
class WorkingTime < ApplicationRecord
  belongs_to :task

  scope :specify, ->(task_id, date) { where(task_id: task_id, recorded_at: date) }

  # 特定日から今日までの特定タスクに紐づくworking_timesの取得
  scope :search_until_today, ->(task_id, date) { where(task_id: task_id, recorded_at: [date..Date.today]) }

  class << self

    def working_time_with_task_id_hash
      WorkingTime.all.group_by(&:task_id).each_with_object({}) do |(task_id, working_times), hash|
        sum_working_times = working_times.sum { |wt| sum_working_time_per_task(wt) }
        hash[task_id] = sum_working_times
        hash
      end
    end

    # 特定日のworking_timeのtimesの合計を取得する（返却は秒）
    def sum_working_time_per_task(working_time)
      working_time&.times&.sum { |time| (Time.parse(time['end_at']) - Time.parse(time['start_at'])).to_i }
    end

    def sum_working_time(task, type)
      case type
      when :day
        sum_working_time_per_task(WorkingTime.where(task_id: task.id, recorded_at: date))
      when :all
        # taskに紐づく全てのworking_timeの和を返す
        sum_working_time_per_task
      end
    end
  end
end
