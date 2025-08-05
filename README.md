# Pokedex

A full-stack Pokedex application built with Django REST Framework and React.

## Tech Stack

- **Backend**: Django REST Framework
- **Frontend**: React with TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL

## Project Structure

```
pokedex/
├── manage.py              # Django management script
├── pokedex/              # Django project settings
├── pokemon/              # Django app for Pokemon data
├── pokedex-client/       # React frontend application
└── scripts/              # Data loading scripts
```

## Setup Instructions

### Backend (Django)

1. **Install PostgreSQL (if not already installed):**

   On macOS with Homebrew:
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

   On Ubuntu/Debian:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo service postgresql start
   ```

2. **Create a PostgreSQL superuser and database:**

   Open the PostgreSQL prompt:
   ```bash
   psql postgres
   ```

   Then, in the psql shell, run:
   ```sql
   CREATE USER pokedex_user WITH PASSWORD 'yourpassword' SUPERUSER;
   CREATE DATABASE pokedex_db OWNER pokedex_user;
   \q
   ```

   Update your Django `settings.py` to use these credentials.

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install dependencies:**

   ```bash
   pip install django djangorestframework django-cors-headers psycopg2-binary
   ```

   > **Note for Apple Silicon (ARM/M1/M2) Macs:**  
   > If you encounter issues installing `psycopg2-binary`, try:
   >
   > ```bash
   > ARCHFLAGS="-arch arm64" pip install django djangorestframework psycopg2-binary
   > ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Load Pokemon data:**
   ```bash
   python scripts/load_data.py
   ```

7. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

### Frontend (React)

1. Navigate to the client directory:
   ```bash
   cd pokedex-client
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

The frontend will be available at `http://localhost:5173/`

## API Endpoints

- `GET /api/pokemon/` - List all Pokemon
- `GET /api/pokemon/{id}/` - Get Pokemon details
- Additional endpoints available based on the Django app configuration

## Features

- Browse Pokemon list
- View detailed Pokemon information
- Search for Pokemon by name
- Filter Pokemon by type
- Sort Pokemon by name, number, or type
