FROM node:12.18.1
WORKDIR /app
#COPY ["package.json", "package-lock.json*", "./"]
COPY . .
RUN npm install --production
#COPY . .
EXPOSE 3000
CMD [ "node","server.js" ]



