# lda-board
LDA-board is a topic model visualization UI using LDA.

![lda-board](https://github.com/treasure-data/lda-board/raw/master/public/screen_shot.png)

LDA-board was designed to easily analyze data on Treasure Data.

## Features
- Manage workflow executions
- Run your digdag workflow with session params
- Visualize clusters in two-dimensional space
- Filter topic by terms
- Retrieve docids/userid in the specified topic
- Display Additional contents column for each document/user

## Quick start
```
$ git clone git@github.com:treasure-data/lda-board.git
$ cd lda-board
$ docker-compose build
$ docker-compose up
$ open http://localhost:3000/sign_in 
```

Please run `rails db:setup` and `rails assets:precompile` as ad hoc task.
```
$ docker-compose run web bundle exec rails db:setup
$ docker-compose run web bundle exec rails assets:precompile
```

## LDA Workflow
Sample workflows are available on https://github.com/treasure-data/lda-board/tree/master/workflow_examples

## Deploy using Docker
Lda-board can be deploy using Docker.
Some environment variables are available for connecting an external PostgreSQL instance (e.g. Official Docker images, Amazon RDS).
```
docker build -t lda-board:latest .
docker run -d -p 8080:8080 --name lda-board-web -e LDA_BOARD_DATABASE_DBNAME=... -e LDA_BOARD_DATABASE_HOST=... -e LDA_BOARD_DATABASE_PASSWORD=... -e LDA_BOARD_DATABASE_USERNAME=... lda-board:latest sh -c "bundle exec rails db:migrate && bundle exec rake assets:precompile && bundle exec rails s -p 8080 -b 0.0.0.0"
```

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

Open http://localhost:3000/sign_in 
