Rails.application.routes.draw do
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
  get 'session/new'
  get '/signup', to: 'signup#new'
  post '/signup', to: 'signup#create'
  namespace :admin do
    resources :users
  end

  root to: 'tasks#index'
  namespace 'api', format: :json do
    resources :tasks do
      post :import, on: :collection
    end
    # タスク一覧画面でのタスク別の更新することがある
    put 'tasks', to: 'tasks#update'
    # タグ一覧画面からの処理
    resources :tags, only: %w[index create update destroy]
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
