FROM node:12.13.0-alpine
RUN apk add --no-cache --update \
  g++ \
  gcc \
  libgcc \
  libstdc++ \
  linux-headers \
  make \
  python

WORKDIR /var/jenkins_home/workspace/woke/src/

CMD [ "node", "server.js" ]