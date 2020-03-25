FROM node:13-alpine

COPY . /app
WORKDIR /app
RUN npm install
