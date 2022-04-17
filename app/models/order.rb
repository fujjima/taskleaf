class Order < ApplicationRecord
  belongs_to :task
  belongs_to :list
end
