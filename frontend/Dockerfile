# build environment
FROM node:14 as build

MAINTAINER equipe7

WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin:$PATH

ENV REACT_APP_BACKEND_SVC=http://localhost:9090

COPY package.json ./

COPY package-lock.json ./

RUN npm ci --silent

RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

RUN npm run build

#Production based NGINX
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]