Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # フロントとのオリジンが異なる場合、fetchなどを受け取るため、CORSの設定が必要
    origins 'localhost:8080'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             # cookieを使用したいので、withCredentialsの設定をしている
             credentials: true
  end
end
