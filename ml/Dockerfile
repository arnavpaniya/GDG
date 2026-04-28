# ── Stage 1: Builder ─────────────────────────────────────────────────────── #
# Install dependencies in a separate layer so they are cached between builds.
FROM python:3.11-slim AS builder

WORKDIR /install

# Copy only requirements first (maximises Docker layer cache)
COPY requirements.txt .

RUN pip install --upgrade pip \
 && pip install --no-cache-dir --prefix=/install/deps -r requirements.txt


# ── Stage 2: Runtime ─────────────────────────────────────────────────────── #
FROM python:3.11-slim

# Non-root user for security
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install/deps /usr/local

# Copy application source
COPY . .

# Ensure the data directory exists (pipeline reads CSVs from here)
# The backend/src/data/ path is referenced in pipeline.py — we replicate it.
RUN mkdir -p /app/data
COPY data/biased_dataset.csv /app/data/biased_dataset.csv
COPY data/fair_dataset.csv   /app/data/fair_dataset.csv

# Switch to non-root user
USER appuser

# Cloud Run injects PORT at runtime (default 8080)
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DATA_DIR=/app/data

EXPOSE 8080

# Use gunicorn for production (multi-worker, handles concurrent requests)
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8080", \
     "--workers", "2", \
     "--threads", "4", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "app:app"]
