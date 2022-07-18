FactoryBot.define do
  factory :list do
    name { Faker::Games::Touhou.character }
    board { nil }
  end
end
