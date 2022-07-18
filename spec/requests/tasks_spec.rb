require 'rails_helper'

RSpec.describe Api::TasksController, type: :request do
  let!(:user) {
    create(:user, :has_board_with_five_tasks)
  }
  # let(:user_b) { create(:user, name: 'テストユーザーB', email: 'b@example.com', password: 'testB') }
  # let!(:board) { create(:board, user: user) }
  # let!(:list) { create(:list, board: board) }
  
  # let!(:task_a) { create(:task, name: 'タスクA', user: user ) }
  # let(:task_b) { create(:task, name: 'タスクB', user: user_b) }
  # let(:lists){   { list_id: list.id , list_name:  } }

  before do
    post api_login_path, params: { session: {email: user.email, password: user.password} }
  end

  def reset_session
    get api_logout_path, params: {}
    # allow_any_instance_of(ActionDispatch::Request).to receive(:session).and_return({})
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
    context '正常なパラメータが送信されてきた時' do
      it '同リスト内でのタスク移動が正常に行えること' do
        # TODO: listの変数を用意しておく
        # TODO: tasksを用意しておく
        patch api_task_path, params: { list_id: list_id, tasks: tasks }
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(json['task']['name']).to eq('タスクA')
      end

      it '異なるリスト内でのタスク移動が正常に行えること' do
        get api_task_path(task_a.id), params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(json['task']['name']).to eq('タスクA')
      end
    end

    context '異常なパラメータが送信されてきた時' do
      it 'タスクの順序の更新が行われないこと' do
        get api_task_path(task_a.id), params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(json['task']['name']).to eq('タスクA')
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
