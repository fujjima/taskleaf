if @tags.present?
  json.usable_tags @tags, :id, :name
end

json.tasks do
  json.array! @tasks do |task|
    json.extract! task, :id, :name, :description, :finished_at, :elapsed_time
    json.partial! 'shared/tags', tags: task.tags
  end
end
