#!/bin/bash
REGISTRY=hub.lumigame.com
if [ -f ".env.docker" ]; then
  export $(grep -v '^#' .env.docker | xargs -d '\n')
fi
if [ -n "$HUB_TOKEN" ]; then
  echo "$HUB_TOKEN" | docker login -u "$HUB_LOGIN" --password-stdin $REGISTRY
fi

docker pull $REGISTRY$IMAGE:latest || true
docker build \
  --build-arg NPM_TOKEN \
  --tag $REGISTRY$IMAGE:$VERSION \
  --cache-from $REGISTRY$IMAGE:latest \
  -- .
docker push $REGISTRY$IMAGE:$VERSION
docker tag $REGISTRY$IMAGE:$VERSION $REGISTRY$IMAGE:latest
docker push $REGISTRY$IMAGE:latest
