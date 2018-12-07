class SessionsController < ApplicationController
  skip_before_action :login_required

  def new
  end

  def create
    # 検索条件を指定して、最初の一件を取得
    user = User.find_by(email: session_params[:email])
    if user&.authenticate(session_params[:password])
      session[:user_id] = user.id
      redirect_to root_path, notice: 'ログインしました！'
    else
      flash.now[:danger] = 'メールアドレスかパスワードが違います'
      render :new
    end
  end

  def destroy
    # reset_sessionだと、セッション内の全てのデータを削除する
    reset_session
    redirect_to root_path, notice: 'ログアウトしました！'
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
