module RequestSpecHelper
  %i[get post put patch delete head].each do |name|
    define_method(name) do |path, params: {}, headers: {}|
      super(path, params: params&.to_json, headers: default_request_headers&.merge(headers))
    end
  end
end
