require 'rails_helper'

RSpec.describe Api::TasksController, type: :request do
  let!(:user) {
    create(:user, :has_board_with_five_tasks)
  }

  before do
    post api_login_path, params: { session: {email: user.email, password: user.password} }
  end

  def reset_session
    get api_logout_path, params: {}
  end

  shared_examples_for 'ユーザーAが作成したタスクが表示される' do
    it { expect(page).to have_content '最初のタスク' }
  end

  describe 'task#index' do
    context 'ログイン時' do
      it 'タスクが表示されること' do
        get api_tasks_path, params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        # TODO: 他ユーザーのタスクが混じっていないことを確認したい
        expect(json["datas"][0]["tasks"].length).to eq(5)
      end
    end

    context '非ログイン時' do
      it 'ログイン画面にリダイレクトされること' do
        reset_session
        get api_tasks_path, params: {}
        expect(response.status).to eq(302)
        expect(response.status).to redirect_to api_login_path
      end
    end
  end

  # タスクの詳細モーダルが復活するまでは保留
  xdescribe 'task#show' do
    context 'ユーザーAのログイン時' do
      it '選択したタスクの詳細が表示されること' do
        get api_task_path(task_a.id), params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(json['task']['name']).to eq('タスクA')
      end
    end
  end

  describe 'task#update_tasks_order' do
    let(:order_params) do
      user.tasks.map.with_index do |task, index|
          {
            position: index + 1,
            task_id: task.id,
            list_id: user.boards.take.lists.take.id
          }
      end
    end

    context '正常なパラメータが送信されてきた時' do
      it '同リスト内でのタスク移動が正常に行えること' do
        order_params = user.tasks.map.with_index do |task, index|
          # 1番目と2番目のタスクのpositionを入れ替える
          position = case index
            when 0 then 2
            when 1 then 1
            else index + 1
            end
          {
            position: position,
            task_id: task.id,
            list_id: user.boards.take.lists.take.id
          }
        end
        patch '/api/tasks', params: { order_params: order_params }
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        # FIXME: あまりにもテスト内容が分かりづらいので修正する
        expect(json["datas"][0]["tasks"].map{ |item| item["id"] }).to eq(order_params.sort_by{ |item| item[:position] }.pluck(:task_id))
      end

      xit '異なるリスト内でのタスク移動が正常に行えること' do
        get api_task_path(task_a.id), params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(json['task']['name']).to eq('タスクA')
      end
    end

    # TODO: positionの更新時のバリデーションが一通り整備されたらテストする
    context '異常なパラメータが送信されてきた時' do
      context 'リスト内のタスク数以上のposition値が送信されてきた時' do
        xit 'タスクの順序の更新が行われないこと' do
          incorrect_order_params = order_params.map do |param|
            param[:position] = Float::INFINITY if param[:position] == 1
            param
          end
          patch '/api/tasks', params: { order_params: order_params }
          json = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(json['task']['name']).to eq('タスクA')
        end
      end
    end
  end

  xdescribe 'task#create' do
    context 'タスク作成成功時' do
      # let(:task_name) { '新規作成のテストを書く' }

      it '正常に登録される' do
        # expect(page).to have_selector '.alert-success', text: '新規作成のテストを書く'
      end
    end

    context 'タスク作成失敗時' do
      # let(:task_name) { '' }

      it 'エラーとなる' do
        within '#error_explanation' do
          # expect(page).to have_content '名称を入力してください'
        end
      end
    end
  end
end
