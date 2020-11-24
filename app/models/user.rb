class User < ApplicationRecord
  # userテーブルにpasswordを保存する時に、暗号化してくれる
  # authenticate（ログイン認証用）メソッドが使えるようになる
  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  has_many :tasks
end
