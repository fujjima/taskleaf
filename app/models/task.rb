class Task < ApplicationRecord
  has_one_attached :image

  validates :name, presence: true, length: { maximum: 30 }
  validate :validate_name_not_including_comma

  belongs_to :user

  # データについて、新しい順に取得する
  scope :recent, -> { order(created_at: :desc) }

  # 検索可能なカラムの指定
  def self.ransackable_attributes(auth_object = nil)
    %w[name created_at]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end

  def self.csv_attributes
    ["name", "description", "created_at", "updated_at"]
  end

  def self.generate_csv
    CSV.generate(headers: true) do |csv|
      csv << csv_attributes
      all.each do |task|
        csv << csv_attributes.map{ |attr| task.send(attr) }
      end
    end
  end

  private

  def validate_name_not_including_comma
    errors.add(:name, 'にカンマを含めることは出来ません！') if name&.include?(',')
  end
end
