class Api::TasksController < ApplicationController
  before_action :set_task, only: %w[show update]
  # before_action :set_tasks_and_working_times, only: %w[index]
  before_action :set_useable_tags, only: %w[index show]

  def index
    # FIXME: boards.last部分は将来的に、表示中のboardのみになるのでそれまでは決め打ちでlastにしておく
    lists = current_user.boards.last.lists
    tasks = current_user.tasks.eager_load(:order, :tags)
    @datas = lists.reduce([]) do |array, list|
      array.push({
        list_id: list.id,
        list_name: list.name,
        tasks: tasks.where(order: { list_id: list.id })
                    .sort_by(&:position)
      })
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
    # TODO: 恐らくorderに関するパラメータも受け取るため、そのパラメータをもとにorderの生成を行う
    @task = current_user.tasks.new(task_params)

    if @task.save
      render :show
    else
      # TODO: エラーメッセージ
      render :index
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
  # 期待するリクエストパラメータ
  # { tasks: [], list_id: num }
  # TODO: 紐づくlist.idがリクエストパラメータのものと異なる場合、list.idの更新を行う
  def update_tasks_order
    # 使用ケース
    #   リスト内のカードの移動、リスト間でのカードの移動、タスク追加、タスク削除
    Order.update_order(order_params)
    set_tasks_and_working_times
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

  def set_tasks_and_working_times
    # @q = current_user.tasks.ransack(params[:q])
    # @tasks = @q.result(distinct: true).page(params[:page]).order('created_at DESC')
    @working_times = WorkingTime.total_working_time_per_task
    @tasks = current_user.tasks
                         .eager_load(:tags, :order)
                         .sort_by{ |task| task.position }
  end

  def set_useable_tags
    @tags = current_user.tags
  end

  def order_params
    # TODO: リスト内の順番を受け取る方向性について（positionパラメータを必要とするか、task_idの配列内の順番で考えるか）
    params.require(:order_params).map{ |param| param.permit(:position, :task_id).to_h }
  end
end
