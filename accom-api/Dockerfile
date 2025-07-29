FROM node:24-alpine3.21

WORKDIR /

COPY . .

RUN rm -rf node_modules && \
    rm -f package-lock.json && \
    npm cache clean --force && \
    npm install

EXPOSE 8800

CMD ["node", "index.js"]