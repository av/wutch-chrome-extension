FROM mhart/alpine-node

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN yarn

COPY . /app/
EXPOSE 1234
CMD ["yarn", "dev"]
