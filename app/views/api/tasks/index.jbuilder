if @tags.present?
  json.usable_tags @tags, :id, :name
end

json.tasks do
  json.array! @tasks do |task|
    json.extract! task, :id, :name, :description, :finished_at
    json.partial! 'shared/tags', tags: task.tags
    if working_time = @working_times[task.id]
      json.working_time working_time
    end
  end
end
