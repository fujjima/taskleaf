json.usable_tags @tags, :id, :name if @tags.present?

json.task do
  json.extract! @task, :id, :name, :finished_at, :description, :status
  json.partial! 'shared/tags', tags: @task.tags
  # TODO: 特定タスクのworking_timeを渡せるようにしておく
end
