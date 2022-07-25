class List < ApplicationRecord
  belongs_to :board
  has_many :orders, dependent: :destroy

  def tasks
    return [] if orders.empty?
    orders.map(&:task)
  end
end
