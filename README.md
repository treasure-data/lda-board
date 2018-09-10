# lda-board
Auto segmentation UI using LDA

![lda-board](https://github.com/treasure-data/lda-board/raw/master/public/screen_shot.png)

## Quick start
```
$ git clone git@github.com:treasure-data/lda-board.git
$ cd lda-board
$ docker-compose build --no-cache
$ docker-compose up -d
$ docker-compose run web bundle exec rake db:create db:migrate
$ docker-compose run web bundle exec rake assets:precompile
$ open http://localhost:3000/sign_in 
```

## Development guide
You can up only db-server on docker:
```
$ docker-compose up postgresql
```

### Running
```
rake db:create db:migrate
bundle install
yarn install
./bin/webpack-dev-server
rails s
```
