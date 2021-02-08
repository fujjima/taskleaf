json.task do
  json.extract! @task, :id, :name, :finished_at, :description, :status
  json.partial! 'shared/tags', tags: @task.tags
end
