class ApplicationController < ActionController::Base
  add_flash_types :success, :info, :warning, :danger
  before_action :login_required

  helper_method :current_user

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  # サインアップしていないユーザーがログインしようとすると弾いてしまうので削除？
  def login_required
    redirect_to login_path unless current_user
  end
end
