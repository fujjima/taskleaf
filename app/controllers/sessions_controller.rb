class SessionsController < ApplicationController
  skip_before_action :login_required

  def new; end

  def create
    # rails apiモード時のログイン処理にしないといけない
    # 認証周りについては、トークンは送信されてこないためその他の方法で行う。
    # HTTPヘッダーに付与されている
    # binding.pry
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
