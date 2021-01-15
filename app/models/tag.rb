class Tag < ApplicationRecord
  belongs_to :user
  # この時、[user_id, name]でunique_indexを貼る
  has_many :task_tags, dependent: :destroy
  has_many :tasks, through: :task_tags
end
