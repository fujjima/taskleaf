Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # webpack-dev-server(port:8080)からのリクエストのみ許可する
    origins 'localhost:8080'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             # cookieを使用したいので、withCredentialsの設定をしている
             credentials: true
  end
end
