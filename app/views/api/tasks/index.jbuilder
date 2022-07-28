json.usable_tags @tags, :id, :name if @tags.present?

json.datas do
  json.array! @datas do |data|
    # TODO: task用のpartialの用意
    # positionも一緒に送信した方がテストはしやすい
    json.list_id data[:list_id]
    json.list_name data[:list_name]
    json.tasks do |json|
      json.array! data.fetch(:tasks, []) do |task|
        json.extract! task, :id, :name, :description, :finished_at, :status
        json.partial! 'shared/tags', tags: task.tags
        if working_time = @working_times&.dig(task.id)
          json.working_time working_time
        end
      end
    end
  end
end
