FROM hub.lumigame.com/docker-hub/library/node:lts-slim
ARG NPM_TOKEN
ENV NODE_ENV production
WORKDIR /app
COPY package.build.json ./package.json
COPY .npmrc ./
RUN npm install --install-strategy=nested --omit=dev
COPY .*.env ./
COPY src src
COPY package.json tsconfig.json tsconfig.base.json ./
ENTRYPOINT [ "npm", "run" ]
CMD [ "env" ]
