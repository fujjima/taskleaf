# 最新ユーザーに対して、複数のタグ付き・作業時間付きタスクを作成する
user = User.last

ActiveRecord::Base.transaction do
  (1..5).each do |i|
    user.tasks.create(name: "テストタスク#{i}", description: "これは詳細#{i}")
    user.tags.create(name: "テストタグ#{i}")
  end

  # タスクに紐づくworking_timeを1個ずつ生成する
  created_at = Date.new(2020, 11, 10)
  start_date = Time.new(2020, 11, 10, 12, 0o0, 0o0)
  end_date = Time.new(2020, 11, 10, 13, 30, 30)

  created_tasks = user.tasks.last(5)
  created_tags = user.tags.last(5)
  created_tasks.each do |t|
    WorkingTime.create(
      task_id: t.id,
      recorded_at: created_at,
      times: [{ start_at: start_date, end_at: end_date }]
    )

    task_tags = created_tags.sample(2).map { |c| TaskTag.new(task_id: t.id, tag_id: c.id) }
    TaskTag.import(task_tags)
  end
end
