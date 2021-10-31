FROM node:14.15.0 as builder

WORKDIR /usr/src/hakhak

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn gqlgen

RUN yarn build && \
    yarn install --production

FROM node:14.15.0-alpine3.10 as runner

COPY --from=builder /usr/src/hakhak/node_modules ./node_modules
COPY --from=builder /usr/src/hakhak/package.json ./package.json
COPY --from=builder /usr/src/hakhak/dist ./dist
COPY --from=builder /usr/src/hakhak/src/user/user.graphql ./dist/user
COPY --from=builder /usr/src/hakhak/src/board/board.graphql ./dist/board

EXPOSE 3000