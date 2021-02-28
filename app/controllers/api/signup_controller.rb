class Api::SignupController < ApplicationController
  skip_before_action :login_required

  def new
    @user = User.new
  end

  # TODO
  # この時に保存されたuidと、firebaseから払い出されたuidを照合し、合致したら情報を返す

  def create
    # tokenの確認を行う前にGoogleのx509証明書をダウンロードする必要がある
    # ダウンロードした証明書はRedisに保存される
    FirebaseIdToken::Certificates.request
    raise ArgumentError, 'BadRequest Parameter' if payload.blank?

    @user = User.find_or_initialize_by(uid: payload['sub'])
    @user.assign_attributes(user_params)
    if @user.save
      render json: @user, status: :ok
    else
      # render :new
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end

  def token_from_request_headers
    request.headers['Authorization']&.split&.last
  end

  def token
    params[:token] || token_from_request_headers
  end

  def payload
    # 検証OK：デコード結果を返却
    # 検証NG:nilを返却
    @payload = FirebaseIdToken::Signature.verify token
  end
end
