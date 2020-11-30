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
      post :confirm, action: :confirm_new, on: :new
      post :import, on: :collection
    end
    # タスク一覧画面でのタスク情報の更新に使用する
    put 'tasks', to: 'tasks#update'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
