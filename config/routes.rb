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
    resources :tasks, except: :destroy do
      delete :destroy, on: :collection
      post :import, on: :collection
    end
    # タスク一覧画面でのタスク別の更新することがある
    put 'tasks', to: 'tasks#update'
    resources :tags, only: %w[index create update destroy]
    resources :reports, only: %w[index] do
      # レポート画面での期間を指定された時の検索アクション
      get 'period', to: 'reports#period'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
