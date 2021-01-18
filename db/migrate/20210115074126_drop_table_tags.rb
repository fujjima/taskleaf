class DropTableTags < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :taggings, :tags
    drop_table :tags
    drop_table :taggings
  end
end
