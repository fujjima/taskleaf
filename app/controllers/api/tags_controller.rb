class Api::TagsController < ApplicationController
  before_action :set_tags, only: %w[index]
  before_action :set_tag, only: %w[update destroy]

  def index
  end

  # タグ個体の返却をする場合
  def show
  end

  def update
    @tag.update!(tag_params)
    render :show
  end

  def create

  end

  def destroy
    @tag.destroy
    render json: { status: 200 }
  end

  private

  def set_tags
    @tags = current_user.tags
  end

  def set_tag
    @tag = current_user.tags.find(params[:id]) || current_user.tags.find(params[:tag][:id])
  end

  def tag_params
    params.require(:tag).permit(:id, :name)
  end
end
