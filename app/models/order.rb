class Order < ApplicationRecord
  belongs_to :task
  belongs_to :list


  class << self
    def update_order order_list
      # TODO: 例外にしたいケース
      #   配列内に異なるリスト or 異なるboardに属するタスクが検出される
      #   position被り
      # TODO: 値に対するバリデーションを事前にかけておきたい
      # TODO: list間の移動時は、list_idも変更されるようにする
      # FIXME: ひとまずlist_idには1を指定しておく
      order_list.map{ |order_item| order_item[:list_id] = 1 }

      # TODO: 更新時は updated_atのみ更新するようにしたい
      upsert_all(order_list, on_duplicate: :update, unique_by: :task_id)
    end
  end
end
