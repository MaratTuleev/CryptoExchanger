FROM ruby:3.2.7

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /crypto-server

COPY Gemfile /crypto-server/Gemfile
COPY Gemfile.lock /crypto-server/Gemfile.lock

RUN bundle install  # устанавливаем все гемы из Gemfile

COPY . /crypto-server

CMD ["bash", "-c", "bin/rails db:create db:migrate && bin/rails server -b '0.0.0.0'"]