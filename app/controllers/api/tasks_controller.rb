class Api::TasksController < ApplicationController
  before_action :set_task, only: %w[show update]
  before_action :set_tasks, only: %w[index]
  before_action :set_useable_tags, only: %w[index show]

  def index
    # TODO: かつ、positionの配列も渡しておく？
    @working_times = WorkingTime.total_working_time_per_task
    respond_to do |format|
      format.json
    end
  end

  def show
    @working_time = WorkingTime.total_working_time @task.id
    respond_to do |format|
      format.json
    end
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
    Task.where(id: params[:id]).destroy_all
    render json: { status: 200 }
  end

  # TODO: ユーザー入力値についてのバリデーション等の対策
  def update_tasks_order
    # タスク内の順番の一括更新
    # 使用ケース
    #   リスト内のカードの移動、リスト間でのカードの移動、タスク追加、タスク削除
    Order.update_order(order_params)
    render :index
  end

  private

  # XXX: 中間テーブルに関する情報を毎回ここのparams内で取得するのが面倒
  def task_params
    params.require(:task).permit(:name, :description, :image, :finished_at, :times, :status, tag_ids: [])
  end

  def set_task
    # TODO: params[:task][:id]のパターンが必要かについて
    @task = current_user.tasks.find(params[:id]) || current_user.tasks.find(params[:task][:id])
  end

  def set_tasks
    # @q = current_user.tasks.ransack(params[:q])
    # @tasks = @q.result(distinct: true).page(params[:page]).order('created_at DESC')
    @tasks = current_user.tasks
                         .includes(:tags)
                         .sort_by(&:order)
  end

  def set_useable_tags
    @tags = current_user.tags
  end

  def order_params
    # TODO: リスト内の順番を受け取る方向性について（positionパラメータを必要とするか、task_idの配列内の順番で考えるか）
    params.require(:order_params).map{ |param| param.permit(:position, :task_id).to_h }
  end
end
