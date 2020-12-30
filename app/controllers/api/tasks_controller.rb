class Api::TasksController < ApplicationController
  before_action :set_task, only: %w[show update destroy]
  before_action :set_tasks, only: %w[index]

  def index
    respond_to do |format|
      format.json
      # format.html
      # format.csv { send_data @tasks.generate_csv, filename: "tasks-#{Time.zone.now.strftime('%Y%m%d%S')}.csv" }
    end
  end

  def show
    render json: { status: 200, task: @task }
  end

  def new
    # 保存に失敗した場合にrenderされるが、newアクションは経由しない
    @task = Task.new
  end

  def create
    # 保存失敗時、@taskの情報（ユーザ入力情報）を保持しておく
    # redirect_toの際に@taskを渡すと、ID値を含んだURLが返ってくる
    @task = current_user.tasks.new(task_params)

    # 戻るボタンが押されたら新規作成画面に戻る
    if params[:back].present?
      render :new
      return
    end

    if @task.save
      TaskMailer.creation_email(@task).deliver_now
      redirect_to @task, notice: "タスク「#{@task.name}」を登録しました！"
    else
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
