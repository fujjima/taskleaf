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

  # tag_idsが含まれている場合、タグとの紐付けの更新となる
  def update
    @task.update!(task_params)
    render :show
    # redirect_to tasks_path, notice: "タスク 「#{@task.name}を更新しました」"
  end

  def destroy
    @task.destroy
    render json: { status: 200 }
  end

  # 確認画面表示
  def confirm_new
    @task = current_user.tasks.new(task_params)
    render :new unless @task.valid?
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

  def task_params
    params.require(:task).permit(:name, :description, :image, :finished_at, :elapsed_time, tag_ids: [])
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
