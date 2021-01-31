class Api::TasksController < ApplicationController
  before_action :set_task, only: %w[show update destroy]
  before_action :set_tasks, only: %w[index]

  def index
    @tags = current_user.tags
    @working_times = WorkingTime.working_time_with_task_id_hash
    respond_to do |format|
      format.json
    end
  end

  def show
    render json: { status: 200, task: @task }
  end

  def create
    # TODO: finisied_atの文字列をTimeWithZoneに変換しているのはどこで行われているか調査
    @task = current_user.tasks.new(task_params)

    if @task.save
      render :show
    else
      # TODO: エラーメッセージ
      render :new
    end
  end

  def update
    # update! + working_timeに関する更新はtransactionで囲む
    @task.update!(task_params)
    times = params[:task][:times]
    if times
      update_target = WorkingTime.find_by(task_id: @task.id, recorded_at: Date.parse(params[:task][:times][:start_at]))
      if update_target
        update_target.times << times
        update_target.save!
      else
        working_time = WorkingTime.new(
          task_id: @task.id,
          times: [times],
          # TODO: end_atが日を跨いだ場合の対応
          recorded_at: Date.parse(params[:task][:times][:start_at])
        )
        working_time.save!
      end
    end
    render :show
  end

  def destroy
    @task.destroy
    render json: { status: 200 }
  end

  # def import
  #   if params[:files].nil?
  #     set_tasks
  #     redirect_to tasks_path, flash: { danger: 'ファイルを選択してください' }
  #     return
  #   end
  #   current_user.tasks.import(params[:files])
  #   redirect_to tasks_url, notice: 'タスクを追加しました'
  # end

  private

  # XXX: 中間テーブルに関する情報を毎回ここのparams内で取得するのはどうなのだろうか
  def task_params
    params.require(:task).permit(:name, :description, :image, :finished_at, :times, tag_ids: [])
  end

  def set_task
    @task = current_user.tasks.find(params[:id]) || current_user.tasks.find(params[:task][:id])
  end

  def set_tasks
    # @q = current_user.tasks.ransack(params[:q])
    # @tasks = @q.result(distinct: true).page(params[:page]).order('created_at DESC')
    @tasks = current_user.tasks.includes(:tags)
  end
end
