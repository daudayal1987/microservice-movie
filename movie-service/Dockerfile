#Node base image
FROM node:12.16.1

#Create new user
RUN useradd --user-group --create-home --shell /bin/false movie-user

#Update & clean system
RUN apt-get update && \
    apt-get install -y && \
    apt-get autoremove -yqq && \
    apt-get autoclean -yqq && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/apt
    
RUN npm install -g npm 

#Set environment variables
ENV HOME=/home/movie-user

#Set working directory
WORKDIR $HOME/app

#COPY source files into image
COPY package.json npm-shrinkwrap.json ./
COPY src/ ./src

#Install npm dependencies for code
RUN npm install --production

#Change content ownership to new user
RUN chown -R movie-user:movie-user $HOME/* /usr/local/

#Change user as new user
USER movie-user

EXPOSE 3001
CMD ["npm", "start"]