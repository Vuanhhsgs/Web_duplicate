# Use a lightweight Python image
FROM python:3.13-slim

# Install Tesseract OCR
RUN apt-get update && apt-get install -y tesseract-ocr && apt-get clean

# Set working directory
WORKDIR /app

# Copy backend and frontend
COPY Backend/ Backend/
COPY Front\ end/ Front\ end/

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Run Flask app via gunicorn
CMD ["gunicorn", "Backend.generate_diagram:app", "--bind", "0.0.0.0:5000"]
