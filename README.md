# lda-board
Auto segmentation UI using LDA

![lda-board](https://github.com/treasure-data/lda-board/raw/master/public/screen_shot.png)

## Features
- TBD

## Quick start
```
$ git clone git@github.com:treasure-data/lda-board.git
$ cd lda-board
$ docker-compose build # --no-cache
$ docker-compose up # -d
$ docker-compose run web bundle exec rails db:setup
$ open http://localhost:3000/sign_in 
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

Open http://localhost:3000
