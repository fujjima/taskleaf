FactoryBot.define do
  factory :task do
    name { Faker::Creature::Animal.name }
    description { 'テストテキスト' }
    user { nil }
    status { :waiting }
  end
end
