FROM node:12.14.0

RUN useradd --user-group --create-home --shell /bin/false cinema-catalog-user

RUN apt-get update && \
    apt-get install -y && \
    apt-get autoremove -yqq && \
    apt-get autoclean -yqq && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/apt

RUN npm install -g npm

WORKDIR /usr/apps

COPY package.json package-lock.json ./
COPY src/ ./src

RUN npm install --production

RUN chown -R cinema-catalog-user:cinema-catalog-user /usr/apps /usr/local/
USER cinema-catalog-user

EXPOSE 3002
CMD ["npm", "start"]
