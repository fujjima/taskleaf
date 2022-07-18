FactoryBot.define do
  factory :user, class: User do
    name { 'テストユーザ' }
    email { 'test1@example.com' }
    password { 'password' }
  end

  trait :has_board_with_five_tasks do
    after(:create) do |user|
      board = create(:board, user: user)
      list = create(:list, board: board)
      tasks = create_list(:task, 5, user: user) do |task|
        create(:order, task: task, list: list)
      end
    end
  end
end
