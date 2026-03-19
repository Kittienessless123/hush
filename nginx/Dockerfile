FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/ssl
RUN mkdir -p /var/www/uploads
RUN chmod 755 /var/www/uploads

# ❌ УДАЛИ или закомментируй эту строку:
# RUN nginx -t

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]