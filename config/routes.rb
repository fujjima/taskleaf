Rails.application.routes.draw do
  root to: 'tasks#index'

  namespace :admin do
    resources :users
  end

  namespace 'api', format: :json do
    get '/login', to: 'sessions#new'
    post '/login', to: 'sessions#create'
    get '/logout', to: 'sessions#destroy'
    get '/signup', to: 'signup#new'
    post '/signup', to: 'signup#create'
    resources :tasks, except: :destroy do
      delete :destroy, on: :collection
    end
    # タスク一覧画面でのタスク別の更新することがある
    put 'tasks', to: 'tasks#update'
    resources :tags, only: %w[index create update destroy]
    resources :reports, only: %w[index] do
      # 単にparamsで取得できる情報があるかないかの違いでOK？
      # get 'period', to: 'reports#period'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
