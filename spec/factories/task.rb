FactoryBot.define do
  factory :task do
    name { 'テストを書く' }
    description { 'Rspec & Capybra & FactoryBotを準備する' }
    user
  end
end