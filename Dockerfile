FROM ruby:2.6.3

# Dockerイメージ構成のプロセスの記述

# yarn関連パッケージをapt-getでインストール
# -Sの効果で、エラーメッセージが出力される。
# apt-key add -: パッケージを認証するのに使用するキーの一覧を管理 addで追加
# -: ファイル名を - とすると、標準入力から読み込む

## nodejsとyarnはwebpackをインストールする際に必要
RUN apt-get update && apt-get install -y curl apt-transport-https wget && 
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && 
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && 
apt-get update && apt-get install -y yarn

# # Node.jsをインストール
# RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - && 
# apt-get install nodejs

ENV APP_ROOT /taskleaf

WORKDIR $APP_ROOT
COPY Gemfile $APP_ROOT/Gemfile
COPY Gemfile.lock $APP_ROOT/Gemfile.lock
RUN bundle install
COPY . $APP_ROOT

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]