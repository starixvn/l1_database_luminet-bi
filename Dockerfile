FROM hub.lumigame.com/docker-hub/library/node:18.12-slim
ARG NPM_TOKEN
ENV NODE_ENV production
WORKDIR /app
COPY package.build.json ./package.json
COPY .npmrc ./
RUN npm install --omit=dev
COPY .*.env ./
COPY src src
COPY package.json ./package.json
ENTRYPOINT [ "npm", "run" ]
CMD [ "env" ]
