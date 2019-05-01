class SignupController < ApplicationController
  before_action :set_user
  skip_before_action :login_required

  # signup時にユーザーを初期化する
  def new
    @user = User.new
  end

  def create; end

  def destroy; end
end
