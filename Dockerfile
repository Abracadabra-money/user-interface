FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/
COPY ./dist /usr/share/nginx/html/

ARG NGINX_MODE=prod
COPY robots.txt.$NGINX_MODE /usr/share/nginx/html/robots.txt
