# メーラー用のテスト
require 'rails_helper'

describe TaskMailer, type: :mailer do
  let(:task) { FactoryBot.create(:task, name: 'メイラーSpecを書く', description: '送信したメールの内容を確認します') }

  let(:text_body) do
    part = mail.body.parts.detect { |pr_part| pr_part.content_type == 'text/plain; charset=UTF-8' }
    part.body.raw_source
  end
  let(:html_body) do
    part = mail.body.parts.detect { |pr_part| pr_part.content_type == 'text/html; charset=UTF-8' }
    part.body.raw_source
  end

  # FIXME: メーラー機能が仮に復活するのであれば復活させる
  xdescribe '#creation_email' do
    let(:mail) { TaskMailer.creation_email(task) }

    it '想定通りのメールが生成されている' do
      # ヘッダ
      expect(mail.subject).to eq('タスク作成完了メール')
      expect(mail.to).to eq(['user@example.com'])
      expect(mail.from).to eq(['taskleaf@example.com'])

      # text形式の本文
      expect(text_body).to match('以下のタスクを作成しました')
      expect(text_body).to match('メイラーSpecを書く')
      expect(text_body).to match('送信したメールの内容を確認します')

      # html形式の本文
      expect(html_body).to match('以下のタスクを作成しました')
      expect(html_body).to match('メイラーSpecを書く')
      expect(html_body).to match('送信したメールの内容を確認します')
    end
  end
end
