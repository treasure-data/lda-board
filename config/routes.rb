Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      resources :datasets, only: [:index, :create, :show] do
        collection do
          get :workflows
        end
        get '/fetch', to: 'datasets#fetch'
        get '/status', to: 'datasets#status'
      end
    end
  end

  get '*path', to: 'spa#index'
end
