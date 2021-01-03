class Api::TasksController < ApplicationController
  before_action :set_task, only: %w[show update create destroy]
  before_action :set_tasks, only: %w[index]

  def index
    respond_to do |format|
      format.json
    end
  end

  def show
    render json: { status: 200, task: @task }
  end

  # タスク一覧画面からのアクセスのみを想定
  def create
    @task = current_user.tasks.new(task_params)

    # TODO: taskをnewした際に、どこでfinisied_atの文字列がTimeWithZoneに変換されているのか
    if @task.save
      set_tasks
      render :index
    else
      # TODO: エラーメッセージ
      render :new
    end
  end

  def update
    @task.update!(task_params)
    render json: { status: 200, task: @task }
    # redirect_to tasks_path, notice: "タスク 「#{@task.name}を更新しました」"
  end

  def destroy
    @task.destroy
  end

  # 確認画面表示
  def confirm_new
    @task = current_user.tasks.new(task_params)
    render :new unless @task.valid?
  end

  def import
    if params[:files].nil?
      set_tasks
      redirect_to tasks_path, flash: { danger: 'ファイルを選択してください' }
      return
    end
    current_user.tasks.import(params[:files])
    redirect_to tasks_url, notice: 'タスクを追加しました'
  end

  private

  def task_params
    params.require(:task).permit(:name, :description, :image, :finished_at, :elapsed_time)
  end

  def set_task
    @task = current_user.tasks.find_by(id: params[:id]) || current_user.tasks.find_by(id: params[:task][:id])
  end

  def set_tasks
    @q = current_user.tasks.ransack(params[:q])
    @tasks = @q.result(distinct: true).page(params[:page]).order('created_at DESC')
  end
end
