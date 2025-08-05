# Pokedex

A full-stack Pokedex application built with Django REST Framework and React.

## Tech Stack

- **Backend**: Django REST Framework
- **Frontend**: React with TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: SQLite (default Django)

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

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Load Pokemon data (if scripts are available):
   ```bash
   python manage.py shell < scripts/load_pokemon.py
   python manage.py shell < scripts/load_moves.py
   ```

5. Start the Django server:
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
- Responsive design with Tailwind CSS
- Type-safe frontend with TypeScript

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## License

This project is for educational purposes.