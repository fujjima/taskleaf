class Api::TagsController < ApplicationController
  before_action :set_tags, only: %w[index]

  def index
  end

  def update

  end

  def create

  end

  def destroy

  end

  private

  def set_tags
    @tags = current_user.tags
  end
end
