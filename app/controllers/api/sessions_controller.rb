class Api::SessionsController < ApplicationController
  skip_before_action :login_required

  # TODO: リダイレクトされた場合、メッセージを返して新規登録を促す
  def new; end

  def create
    user = User.find_by(email: params[:session][:email])
    if user&.authenticate(params[:session][:password])
      # TODO: params内のsessionについて
      # https://qiita.com/zettaittenani/items/a75f0da8f44cfe0f85c0#session%E3%81%AE%E5%AE%9F%E4%BD%93%E3%81%AF%E3%81%A9%E3%81%93%E3%81%AB%E3%81%82%E3%82%8B%E3%81%8B
      # TODO: フロント側へのsession_idの送付のタイミングについて
      session[:user_id] = user.id
      @user = user
      @logged_in = true
      respond_to do |format|
        format.json
      end
    else
      # https://qiita.com/kurawo___D/items/d5257e69bcb300908687
      render json: { status: 401, errors: ['認証に失敗しました。', '正しいメールアドレス・パスワードを入力し直すか、新規登録を行ってください。'] }
    end
  end

  def destroy
    # TODO: セッションの期限の設定
    reset_session
    render json: { status: 200 }
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
