#!/bin/bash
REGISTRY=hub.lumigame.com
export $(grep -v '^#' .env.docker | xargs -d '\n')
echo "$HUB_TOKEN" | docker login -u "$HUB_LOGIN" --password-stdin $REGISTRY

docker pull $REGISTRY$IMAGE:latest || true
docker build \
  --build-arg NPM_TOKEN \
  --tag $REGISTRY$IMAGE:$VERSION \
  --cache-from $REGISTRY$IMAGE:latest \
  -- .
docker push $REGISTRY$IMAGE:$VERSION
docker tag $REGISTRY$IMAGE:$VERSION $REGISTRY$IMAGE:latest
docker push $REGISTRY$IMAGE:latest
