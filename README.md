# lda-board
LDA-board is a topic model visualization UI using LDA.

![lda-board](https://github.com/treasure-data/lda-board/raw/master/public/screen_shot.png)

LDA-board was designed to easily analyze data on Treasure Data.

## Features
- Manage workflow executions
- Run your workflow with optional params
- Visualize clusters in two-dimensional space
- Display Additional contents conlumn for each document/user

## Quick start
```
$ git clone git@github.com:treasure-data/lda-board.git
$ cd lda-board
$ docker-compose build
$ docker-compose up
$ open http://localhost:3000/sign_in 
```

Please run `rails db:setup` as adhoc task.
```
$ docker-compose run web bundle exec rails db:setup
```

## Deployment

## Development
### Setup
```
$ git clone git@github.com:treasure-data/lda-board.git
$ cd lda-board
$ bundle install
$ yarn install
$ rake db:setup
```

### Running
1. `docker-compose up postgresql`
2. `rails server`
3. `./bin/webpack-dev-server`

Open http://localhost:3000
