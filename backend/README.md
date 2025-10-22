# Email Campaign Management System

This guide will help you set up and run the Email Campaign Management system.

## Setup Instructions

### 1. Clone the Repository

2. Create and Activate Virtual Environment
cd backend
python -m venv venv
venv\Scripts\activate
For Linux/macOS:
python3 -m venv venv
source venv/bin/activate

3. Install Backend Dependencies
pip install -r requirements.txt

4. Configure Environment Variables
# Database Credentials (PostgreSQL example)
DB_NAME=your_db_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Email SMTP Credentials (for sending emails)
EMAIL_HOST_USER='a1@gmail.com'
EMAIL_HOST_PASSWORD='your_16_digit_app_password' # Use an app password if using services like Gmail
DEFAULT_FROM_EMAIL='a1@gmail.com'
ADMIN_REPORT_EMAIL='admin@example.com'


5. Run Database Migrations
python manage.py makemigrations
python manage.py migrate

6. Start Redis (Celery Broker)
# Pull the Redis image (if you don't have it)
docker pull redis/redis-stack-server:latest # or redis:latest

# Run Redis in a detached mode, mapping port 6379
docker run -d -p 6379:6379 --name my-redis-instance redis/redis-stack-server:latest # or redis:latest

7. Start Celery Worker and Beat
Terminal 1: Celery Worker
celery -A backend worker --loglevel=info --pool=solo
Terminal 2: Celery Beat (Scheduler)
celery -A backend beat -l info

8. Run Django Development Server
python manage.py runserver
