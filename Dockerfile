# npm run build
# docker build --rm -f "Dockerfile" -t paulgilchrist/dnd-tools:latest .
# docker push paulgilchrist/dnd-tools
FROM nginx:alpine
LABEL author="Paul Gilchrist"
COPY ./dist/dnd-tools/index.html /usr/share/nginx/html
COPY ./dist/dnd-tools /usr/share/nginx/html/dnd-tools
RUN rm /usr/share/nginx/html/dnd-tools/index.html
EXPOSE 80 443
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
# docker run -d -p 80:80 paulgilchrist/dnd-tools
# docker rm -f <containerID>
