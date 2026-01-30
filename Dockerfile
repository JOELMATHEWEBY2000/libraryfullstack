FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY . .

WORKDIR /app/backend
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

CMD python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    gunicorn library_backend.wsgi:application \
    --bind 0.0.0.0:${PORT}

