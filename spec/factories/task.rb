FactoryBot.define do
  factory :task do
    name { 'テストタスク' }
    description { 'Rspec & Capybra & FactoryBotを準備する' }
    user
  end
end
