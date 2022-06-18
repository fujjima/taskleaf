class List < ApplicationRecord
  belongs_to :board
  has_many :orders, dependent: :destroy

end
