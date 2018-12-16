class TasksController < ApplicationController

  before_action :set_task, only: %w[show edit update destroy]
  before_action :set_tasks, only: %w[index]

  # 今あるタスクについて、csv形式でも出力するようにする
  def index
    respond_to do |format|
      format.html
      format.csv { send_data @tasks.generate_csv, filename: "tasks-#{Time.zone.now.strftime('%Y%m%d%S')}.csv" }
    end
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
      TaskMailer.creation_email(@task).deliver_now
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
  end

  # 確認画面表示
  def confirm_new
    @task = current_user.tasks.new(task_params)
    render :new unless @task.valid?
  end

  # csvからのインポート
  def import
    if params[:file] == nil
      set_tasks
      redirect_to tasks_path, flash: {danger: 'ファイルを選択してください'}
      return
    end
    current_user.tasks.import(params[:file])
    redirect_to tasks_url, notice: 'タスクを追加しました'
  end

  private

  def task_params
    # 画像のアップロードのため、imageも許可
    params.require(:task).permit(:name, :description, :image)
  end

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  # ログインユーザに紐づくタスクのみ取得できるようにする(=tasks.where(id: current_user.id))
  def set_tasks
    @q = current_user.tasks.ransack(params[:q])
    @tasks = @q.result(distinct: true).page(params[:page])
  end
end
