FROM nginx:alpine
COPY . /usr/share/nginx/html
VOLUME /etc/nginx/conf.d/default
EXPOSE 80
