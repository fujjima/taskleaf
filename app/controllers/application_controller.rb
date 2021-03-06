class ApplicationController < ActionController::Base
  # We may want to disable CSRF protection for APIs since they are typically
  # designed to be state-less. That is, the request API client will handle
  # the session for you instead of Rails.
  # https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/request_forgery_protection.rb#L14
  protect_from_forgery unless: -> { request.format.json? }

  before_action :login_required
  add_flash_types :success, :info, :warning, :danger
  # before_action :check_xhr_header

  helper_method :current_user

  private

  # X-Requested-Withがヘッダにあるかどうかを検証
  def check_xhr_header
    return if request.xhr?

    render json: { error: 'forbidden' }, status: :forbidden
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def login_required
    redirect_to api_login_path unless current_user
  end
end
