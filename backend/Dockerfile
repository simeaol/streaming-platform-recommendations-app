#Base image
FROM node:14

#manteiner names
MAINTAINER equipe7

#Create app directory
WORKDIR /usr/src/app

#RabbitMQ broker instance
ENV RABBIT_MQ_URL=amqp://equipe7:equipe7@173.193.120.98:30082

#Copy all source code from current dir to workdir
COPY . .

#Install node dependencies
RUN npm install

#Port to be exposed
EXPOSE 3333

#RUN application
CMD ["node", "index.js"]

