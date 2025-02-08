FROM alpine:3.21

COPY . /app
RUN \
    apk add --no-cache python3 py3-pip py3-psycopg2 && \
    pip install -r /app/requirements.txt --break-system-packages

WORKDIR /app
CMD ["python3", "playlister.py"]
