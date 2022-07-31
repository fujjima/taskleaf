FactoryBot.define do
  factory :board do
    name { Faker::Games::Pokemon.name }
    user { nil }
    archived_at { '2022-04-17' }
  end
end
