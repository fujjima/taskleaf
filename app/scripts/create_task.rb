# 最後のユーザーに対して複数のタグ付きタスクを作成したい
user = User.last

ActiveRecord::Base.transaction do
  (1..5).each do |i|
    user.tasks.create(name: "テストタスク#{i}", description: "これは詳細#{i}")
    user.tags.create(name: "テストタグ#{i}")
  end
  created_tasks = user.tasks.last(5)
  created_tags = user.tags.last(5)
  created_tasks.each do |t|
    task_tags = created_tags.sample(2).map { |c| TaskTag.new(task_id: t.id, tag_id: c.id) }
    TaskTag.import(task_tags)
  end
end
