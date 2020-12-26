#----------------------
### STAGE 1: BUILD ###
#---------------------

# Create image based on the official Node 10 image from dockerhub
FROM node:10

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Get all the code needed to run the app
COPY . /app/

# Install dependecies
RUN npm install
RUN pwd
RUN ls
RUN chmod +x env.sh
#RUN npm run build
# Expose the port the app runs in
EXPOSE 4200
CMD ./env.sh "$API_KEY" && npm start
# Serve the app
#CMD ["npm", "start"]
#--------------------------------------------------
### STAGE 2: Setup nginx and Deploy application ###
#--------------------------------------------------
#FROM nginx:latest
#
##!/bin/sh
#COPY nginx.conf /etc/nginx/nginx.conf
#
## Copy dist folder from  the builder to nginx public folder(STAGE 1)
#
#COPY --from=build /app/dist/angular-material-admin /usr/share/nginx/html
#
## Expose the port the app runs in
##EXPOSE 4200
#
#CMD ["/bin/bash", "-c", "./env.sh '$API_KEY'","nginx","-g","daemon off;"]
#
