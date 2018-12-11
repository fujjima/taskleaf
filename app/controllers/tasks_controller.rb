class TasksController < ApplicationController

  before_action :set_task, only: %w[show edit update destroy]

  def index
    # ログインユーザに紐づくタスクのみ取得できるようにする(=tasks.where(id: current_user.id))
    @q = current_user.tasks.ransack(params[:q])
    @tasks = @q.result(distinct: true).recent
  end

  def show
  end

  def new
    # 保存に失敗した場合にrenderされるが、newアクションは経由しない
    @task = Task.new
  end

  def edit
  end

  def create
    # @taskの理由は、保存失敗時にrender :newした際、@taskの情報（ユーザ入力情報）を保持しておくため
    # またredirect_toの際に@taskを渡すと「redirect_to url_for(@record)」と同じような結果が得られ、ID値を含んだURLが返ってくる
    @task = current_user.tasks.new(task_params)

    # 戻るボタンが押されたら、新規作成画面に戻る
    if params[:back].present?
      render :new
      return
    end


    if @task.save
      logger.debug "task: #{@task.attributes.inspect}"
      redirect_to @task, notice: "タスク「#{@task.name}」を登録しました！"
    else
      render :new
    end
  end

  def update
    @task.update!(task_params)
    redirect_to tasks_path, notice: "タスク 「#{@task.name}を更新しました」"
  end

  def destroy
    @task.destroy
    redirect_to tasks_path, notice: "タスク「#{@task.name}」を削除しました！"
  end

  # 確認画面表示
  def confirm_new
    @task = current_user.tasks.new(task_params)
    render :new unless @task.valid?
  end

  private

  def task_params
    params.require(:task).permit(:name, :description)
  end

  def set_task
    @task = current_user.tasks.find(params[:id])
  end
end
