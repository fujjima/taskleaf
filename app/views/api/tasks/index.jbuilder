if @tags.present?
  json.usable_tags @tags, :id, :name
end

json.tasks do
  json.array! @tasks do |task|
    json.extract! task, :id, :name, :description, :finished_at, :elapsed_time
    json.tags do
      json.array!(task.tags) do |tag|
        json.id tag.id
        json.name tag.name
      end
    end
  end
end
