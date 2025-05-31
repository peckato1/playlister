FROM alpine:3.21 AS build

COPY ./frontend /build
WORKDIR /build
RUN \
  apk add --no-cache nodejs npm && \
  npm install && \
  npm run build

FROM alpine:3.21
ADD ./requirements.txt /requirements.txt
RUN \
    apk add --no-cache nginx python3 py3-pip py3-psycopg2 py3-aiopg && \
    pip install -r /requirements.txt --break-system-packages && \
    rm /requirements.txt

COPY ./playlister /app/playlister
COPY ./playlister.py /app/playlister.py
COPY ./entrypoint.sh /app/entrypoint.sh

COPY --from=build /build/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/http.d/default.conf

WORKDIR /app
CMD ["/bin/sh", "/app/entrypoint.sh"]
