require 'rails_helper'

RSpec.describe 'signup', type: :request do
  let!(:default_request_headers) { { 'HTTP_ACCEPT': 'application/json' } }
  # let(:user_a) { FactoryBot.create(:user, name: 'テストユーザーA', email: 'a@example.com', password: 'testA') }
  # let(:user_b) { FactoryBot.create(:user, name: 'テストユーザーB', email: 'b@example.com', password: 'testB') }
  # let!(:task_a) { FactoryBot.create(:task, name: 'タスクA', user: user_a) }
  # let!(:task_b) { FactoryBot.create(:task, name: 'タスクB', user: user_b) }

  before do
    # session = defined?(rspec_session) ? rspec_session : {}
    # session.class_eval {
    #   def destroy
    #     nil
    #   end
    # }
    allow_any_instance_of(ActionDispatch::Request).to receive(:session).and_return(user_id: user_a.id)
  end

  def reset_session
    allow_any_instance_of(ActionDispatch::Request).to receive(:session).and_return({})
  end

  describe 'task#index' do
    context 'ユーザーAのログイン時' do
      it 'user_aのタスクが表示されること' do
        get api_tasks_path, params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        # ユーザーBのタスクが混じっていないこと
        expect(json['tasks'].length).to eq(1)
        expect(json['tasks'].first['name']).to eq('タスクA')
      end
    end

    context 'ユーザーA非ログイン時' do
      it 'ログイン画面にリダイレクトされること' do
        reset_session
        get api_tasks_path, params: {}
        expect(response.status).to eq(302)
        expect(response.status).to redirect_to api_login_path
      end
    end
  end

  describe 'task#show' do
    context 'ユーザーAのログイン時' do
      it '選択したタスクの詳細が表示されること' do
        get api_task_path(task_a.id), params: {}
        json = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(json['task']['name']).to eq('タスクA')
      end
    end
  end

  describe 'task#create' do
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
