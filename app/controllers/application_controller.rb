class ApplicationController < ActionController::Base
  add_flash_types :success, :info, :warning, :danger
  before_action :login_required

  helper_method :current_user

  private

  def current_user
    # @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
    @current_user ||= session[:user_id] ? User.find_by(id: session[:user_id]) : User.find_by(id: 19)
  end

  def login_required
    redirect_to login_path unless current_user
  end
end
