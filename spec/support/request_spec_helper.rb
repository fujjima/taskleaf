module RequestSpecHelper
  %i[get post put patch delete].each do |name|
    define_method(name) do |path, params: {}, headers: {}|
      default_request_headers = { 'HTTP_ACCEPT': 'application/json' }
      # super(path, params: params&.to_json, headers: default_request_headers&.merge(headers))
      super(path, params: params, headers: default_request_headers&.merge(headers))
    end
  end
end
