class Api::ReportsController < ApplicationController

  def index
    a_week_ago_day = Date.today - 7
    @report_datas = WorkingTime.where(recorded_at: [a_week_ago_day..Date.today])
                               .group_by(&:recorded_at)
                               .each_with_object([]) do |(recorded_at, working_times), ary|
                                # 1.入出力の比較を雑に書いておく
                                # { re(date): [wt1, wt2], re2: [wt1, wt2] }
                                # →{ re: date, taskname: sum1(wt1のtimesのsum) }
                                hash = {}
                                hash[:recorded_at] = recorded_at
                                ary << sum_hash(working_times, hash)
                                ary
                               end
  end

  private

  def working_time(task_id, date)
    WorkingTime.specify(task_id, date)
  end

  # 特定のworking_timeのsumを求める時に使え
  def sum_working_time(time)
    WorkingTime.sum_working_time_per_task(time)
  end

  def sum_hash(working_times, hash)
    working_times.each do |wt|
      hash[wt.task.name] = sum_working_time(wt)
    end
    hash
  end
end
