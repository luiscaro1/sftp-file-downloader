FROM node:alpine

COPY dist app/

ENV NODE_ENV production 

WORKDIR /app

CMD node bundle.js --bind:0.0.0.0