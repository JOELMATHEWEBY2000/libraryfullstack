FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["gunicorn", "library_backend.wsgi:application", "--bind", "0.0.0.0:$PORT"]
