class TasksController < ApplicationController
  def index
    # ログインユーザに紐づくタスクのみ取得できるようにする(=tasks.where(id: current_user.id))
    @tasks = current_user.tasks.recent
  end

  def show
    @task = current_user.tasks.find(params[:id])
  end

  def new
    # 保存に失敗した場合にrenderされるが、newアクションは経由しない
    @task = Task.new
  end

  def edit
    @task = current_user.tasks.find(params[:id])
  end

  def create
    # @taskの理由は、保存失敗時にrender :newした際、@taskの情報（ユーザ入力情報）を保持しておくため
    # またredirect_toの際に@taskを渡すと「redirect_to url_for(@record)」と同じような結果が得られ、ID値を含んだURLが返ってくる
    @task = current_user.tasks.new(task_params)
    if @task.save
      redirect_to @task, notice: "タスク「#{@task.name}」を登録しました！"
    else
      render :new
    end
  end

  def update
    task = current_user.tasks.find(params[:id])
    task.update!(task_params)
    redirect_to tasks_path, notice: "タスク 「#{task.name}を更新しました」"
  end

  def destroy
    task = current_user.tasks.find(params[:id])
    task.destroy
    redirect_to tasks_path, notice: "タスク「#{task.name}」を削除しました！"
  end

  private

  def task_params
    params.require(:task).permit(:name, :description)
  end
end
