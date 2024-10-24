class Api::ReportsController < ApplicationController
  def index
    working_times_group_by_recorded_at = WorkingTime.where(recorded_at: period_range)
                                                    .group_by(&:recorded_at)

    datas = period_range.map do |date|
      hash = {}
      # XXX: ここでキャメルケース使いたくない
      hash['recordedAt'] = date
      working_times = working_times_group_by_recorded_at[date]
      next hash unless working_times

      hash.merge(sum_hash(working_times))
    end.compact

    @report_datas = datas.map do |d|
      Hash[d.sort]
    end
  end

  private

  def report_params
    params(:report).require(:period)
  end

  def working_time(task_id, date)
    WorkingTime.search_with_task_id_and_date(task_id, date)
  end

  # FIXME: ここでレコード回数分の計算をしてしまっている
  def sum_hash(working_times)
    working_times.each_with_object({}) do |wt, result|
      result[wt.task.name] = WorkingTime.sum_working_time_per_task(wt)
      result
    end
  end

  def period_range
    if params[:start] && params[:end]
      # Invalid Dateは弾く
      # きちんとした値が入っているかを見る
      (Date.parse(params[:start])..Date.parse(params[:end])).to_a
    else
      (Date.today.beginning_of_week..Date.today.end_of_week).to_a
    end
  end
end
