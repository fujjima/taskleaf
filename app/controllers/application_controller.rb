class ApplicationController < ActionController::Base
  # We may want to disable CSRF protection for APIs since they are typically
  # designed to be state-less. That is, the request API client will handle
  # the session for you instead of Rails.
  # https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/request_forgery_protection.rb#L14
  protect_from_forgery unless: -> { request.format.json? }

  add_flash_types :success, :info, :warning, :danger
  # before_action :check_xhr_header
  # before_action :login_required

  helper_method :current_user

  private

  # X-Requested-Withがヘッダにあるかどうかを検証
  def check_xhr_header
    return if request.xhr?

    render json: { error: 'forbidden' }, status: :forbidden
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
    # 検証用
    # @current_user ||= session[:user_id] ? User.find_by(id: session[:user_id]) : User.find_by(id: 19)
  end

  def login_required
    redirect_to login_path unless current_user
  end
end
