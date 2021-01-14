json.task do
  json.extract! @task, :id, :name, :finished_at, :description, :elapsed_time
end
