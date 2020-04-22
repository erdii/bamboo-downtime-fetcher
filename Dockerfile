FROM node:12.14.1-alpine

WORKDIR /app
COPY --chown=root:root package.json package-lock.json /app/
RUN npm install

COPY --chown=root:root src/ src/

ENTRYPOINT [ "/usr/bin/env", "node", "/app/src/index.js" ]
