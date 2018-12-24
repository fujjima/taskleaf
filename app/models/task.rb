class Task < ApplicationRecord
  has_one_attached :image

  validates :name, presence: true, length: { maximum: 30 }
  validate :validate_name_not_including_comma

  belongs_to :user

  paginates_per 20

  # データについて、新しい順に取得する
  scope :recent, -> { order(created_at: :desc) }

  # 検索可能なカラムの指定
  def self.ransackable_attributes(_auth_object = nil)
    %w[name created_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    []
  end

  def self.csv_attributes
    %w[name description created_at updated_at]
  end

  def self.generate_csv
    CSV.generate(headers: true) do |csv|
      csv << csv_attributes
      all.each do |task|
        csv << csv_attributes.map { |attr| task.send(attr) }
      end
    end
  end

  # 1行ごとにデータを抜き取り、1セルずつ、属性ごとにデータを格納する
  def self.import(files)
    files.each do |file|
      CSV.foreach(file.path, headers: true) do |row|
        # importがTaskから呼ばれている場合に、Task.newと同義となる（今回はcurrent_user.tasksから呼ばれているので、タスクにユーザを紐づけてからnewする）
        # headerがないファイルだと、rowの各要素に対して、キーが割り当てられない（row時点で）
        task = new
        task.attributes = row.to_hash.slice(*csv_attributes)
        task.save!
      end
    end
  end

  # ファイルにヘッダーがあるかの確認
  def self.check_header
    self.nil?
  end

  private

  def validate_name_not_including_comma
    errors.add(:name, 'にカンマを含めることは出来ません！') if name&.include?(',')
  end
end
