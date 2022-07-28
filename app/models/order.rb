class Order < ApplicationRecord
  belongs_to :task
  belongs_to :list

  class << self
    def update_order(order_list)
      # TODO: 例外にしたいケース
      #   配列内に異なるリスト or 異なるboardに属するタスクが検出される
      #   position被り
      # TODO: list間の移動時はlist_idも変更されるので、単純にorderのlist_idの紐付きのみの取得だと対応できない
      # TODO: 更新時は updated_atのみ更新するようにしたい

      # TODO: 値のバリデーションパターンについて
      #   移動対象のタスクのpositionについて
      #     移動先のlistのタスク個数を超えている
      #     重複がある
      #     数値以外の値が入っている
      upsert_all(order_list, on_duplicate: :update, unique_by: :task_id)
    end
  end
end
