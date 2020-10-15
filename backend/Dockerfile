#Base image
FROM node:14

#manteiner names
MAINTAINER equipe7

#Create app directory
WORKDIR /usr/src/app

#Copy all source code from current dir to workdir
COPY . .

#Install node dependencies
RUN npm install

#Port to be exposed
EXPOSE 3333

#RUN application
CMD ["node", "index.js"]

