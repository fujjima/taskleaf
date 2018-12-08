require 'rails_helper'

describe 'タスク管理機能', type: :system do
  describe '一覧表示機能' do
    let(:user_a) { FactoryBot.create(:user, name: 'ユーザーA', email: 'a@example.com') }
    let(:user_b) { FactoryBot.create(:user, name: 'ユーザーB', email: 'b@example.com') }

    before do
      # 作成者がユーザーAであるタスクを作成しておく
      FactoryBot.create(:task, name: '最初のタスク', user: user_a)
      # 共通化されたログイン関連の処理
      visit login_path
      find_by_id("session-email").set(login_user.email)
      find_by_id("session-password").set(login_user.password)
      click_button 'ログインする'
    end

    context 'ユーザーAがログインしている時' do
      let(:login_user) { user_a }

      it 'ユーザーAが作成したタスクが表示される' do
        # 作成済みのタスクの名称が画面上に表示されていることを確認
        expect(page).to have_content '最初のタスク'
      end
    end

    context 'ユーザーBがログインしている時' do
      let(:login_user) { user_b }

      it 'ユーザーAが作成したタスクが表示されない' do
        # ユーザーAのタスクが表示されないことを確認
        expect(page).to have_no_content '最初のタスク'
      end
    end
  end
end