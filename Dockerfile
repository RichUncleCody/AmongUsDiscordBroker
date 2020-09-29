FROM node:current
COPY . .
RUN npm install
EXPOSE 8123
CMD node app.js
