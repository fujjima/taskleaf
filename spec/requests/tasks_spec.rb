require 'rails_helper'

RSpec.describe 'task_management', type: :request do
  let(:user_a) { FactoryBot.create(:user, name: 'テストユーザーA', email: 'a@example.com', password: 'testA') }
  let(:user_b) { FactoryBot.create(:user, name: 'テストユーザーB', email: 'b@example.com', password: 'testB') }
  let!(:task_a) { FactoryBot.create(:task, name: 'タスクA', user: user_a) }
  let!(:task_b) { FactoryBot.create(:task, name: 'タスクB', user: user_b) }
  let!(:default_request_headers) { { 'HTTP_ACCEPT': 'application/json' } }

  before do
    allow_any_instance_of(ActionDispatch::Request).to receive(:session).and_return(user_id: user_a.id)
    # request.env["HTTP_ACCEPT"] = 'application/json'
  end

  # shared_examples_for 'ユーザーAが作成したタスクが表示される' do
  #   it { expect(page).to have_content '最初のタスク' }
  # end

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
  end

  describe 'task#show' do
    context 'ユーザーAのログイン時' do
      get api_tasks_path, params: {}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      # ユーザーBのタスクが混じっていないこと
      expect(json['tasks'].length).to eq(1)
      expect(json['tasks'].first['name']).to eq('タスクA')
    end
  end

  describe '新規作成機能' do
    let(:login_user) { user_a }

    before do
      visit new_task_path
      fill_in '名称', with: task_name
      click_button '登録する'
    end

    context '新規作成画面で名称を入力した時' do
      let(:task_name) { '新規作成のテストを書く' }

      it '正常に登録される' do
        expect(page).to have_selector '.alert-success', text: '新規作成のテストを書く'
      end
    end

    context '新規作成画面で名称を入力しなかった時' do
      let(:task_name) { '' }

      it 'エラーとなる' do
        within '#error_explanation' do
          expect(page).to have_content '名称を入力してください'
        end
      end
    end
  end
end
