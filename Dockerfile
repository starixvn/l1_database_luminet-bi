FROM hub.lumigame.com/docker-hub/library/node:18.10-slim
ARG NPM_TOKEN
ENV NODE_ENV production
WORKDIR /app
COPY package.json ./
COPY .npmrc ./
RUN npm install --omit=dev
COPY src src
COPY .*.env ./
ENTRYPOINT [ "npm", "run" ]
CMD [ "env" ]
