# Streaming Recommendations Platform - What2Watch

## Overview
This project is part of hackathon developed by team-7 in behalf of INF-332.

Our purpose is to provide the best movie, series and tv's platform recommendation for everyone and of course, all for free.

Check it out [here](http://what2watch.pratica.me/) or [here](http://what2watch.simeao.com.br/)

## The Stack
We love all programming language without discrimination, but the way. For instance we choose javascript frameworks ( *NodeJS & ReactJS* ) to enhance the team performance and also to speed up prototype and create a MVP always focusing on javascript simplicity.

## Architecture
We love microservices and all the approach behind it and we believe in Docker and Kubernetes. 
All the communication between services and SPA runs over http protocol using RESTFul and JSON.
So take a look at the diagram bellow to deep dive into our platform architecture.

![Architecture](architecture-v2.png)

### Pretty easy, doesn't it ?

#### `Note: Why we are not using INGRESS or NGINX-INGRESS CONTROLLER in Kubernetes ?`
> IBM Kubernetes Service Free tier doesn't offers this capability.

#

## For Developers
### API documentation
> We use swagger to create the api document and it is available only in devopment environment which means, we will not publish it on the web.
If you wanna check swagger-ui, please:

1- Go to backend folder and run `npm start`

2- In your browser, access [swagger-ui](http://localhost:3333/api-docs)

#### Running apps in local machine using docker-compose
> `docker-compose -f docker-compose.yml up -d --build`

### You can also run all apps and services one-by-one
To do that, please `cd` in backend and frontend folder and run the following commands:

> `docker build -t {IMAGE_NAME} .`

> `docker run --name {container-name} -p {HOST_PORT}:{CONTAINER_PORT} {IMAGE_NAME}`

Please, check Dockerfile and see which PORT(s) each service/app uses.

#
## For more info, please don't hesitate to contact us. 
