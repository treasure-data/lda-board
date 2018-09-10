FROM node:10.9 as node
FROM ruby:2.5

WORKDIR /webapp

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node /opt/yarn-* /opt/yarn

RUN apt-get update -qq \
 && apt-get install -y build-essential libpq-dev \
 && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn \
 && ln -s /opt/yarn/bin/yarnpkg /usr/local/bin/yarnpkg

COPY Gemfile Gemfile.lock package.json yarn.lock /webapp/

RUN bundle install
RUN yarn install

COPY . /webapp
