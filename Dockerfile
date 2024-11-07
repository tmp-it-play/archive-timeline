FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p static/uploads && chmod -R 755 static/uploads
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]