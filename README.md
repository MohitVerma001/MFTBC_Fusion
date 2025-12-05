# FUSION Corporate Social Network

**FUSO Brand Theme: Black (#000000 max 30%), Red (#E60000 max 10%), Light Grey (#f5f5f7 min 60%)**

A modern corporate social network built with React (Vite), Node.js (Express), and PostgreSQL.

## Architecture

```
FUSION/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React context providers
│   │   ├── services/     # API modules + HTTP wrapper
│   │   ├── utils/        # Utility functions
│   │   └── assets/       # Images, fonts, etc.
│   ├── public/
│   │   └── env.js        # Runtime environment loader
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/       # Express routes
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models/queries
│   │   ├── middlewares/  # Auth, validation, error handling
│   │   └── config/       # DB config, env loader
│   ├── migrations/       # SQL migration files
│   ├── uploads/          # File uploads
│   ├── package.json
│   └── server.js
│
├── READMEs/           # All documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── BACKEND_DOCUMENTATION.md
│   ├── FRONTEND_DOCUMENTATION.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT_GUIDE.md
│
├── scripts/           # Deployment/setup scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── migrate.sh
│
├── config/            # Global config files
│   ├── .env.example
│   └── docker-compose.yml
│
└── README.md
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + Bootstrap 5
- **UI Components**: Radix UI
- **Routing**: React Router v6
- **Rich Text Editor**: React Quill

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Database**: PostgreSQL 15
- **File Upload**: Multer
- **Validation**: express-validator

### Key Features
- No Supabase (PostgreSQL only)
- Runtime environment configuration
- Centralized API service layer
- Modular backend architecture
- Docker support

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Run setup script**:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Configure environment**:
   Edit `backend/.env` with your database credentials

3. **Create database**:
   ```bash
   createdb fusion_db
   ```

4. **Run migrations**:
   ```bash
   chmod +x scripts/migrate.sh
   ./scripts/migrate.sh
   ```

5. **Start development servers**:

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

### Database Migrations
```bash
./scripts/migrate.sh
```

## API Services

The frontend uses a centralized service layer located in `frontend/src/services/`:

- `http.service.js` - HTTP wrapper with interceptors
- `blogs.api.js` - Blog/news operations
- `spaces.api.js` - Spaces operations
- `categories.api.js` - Category management
- `tags.api.js` - Tag management
- `places.api.js` - Places management
- `upload.api.js` - File upload operations
- `auth.api.js` - Authentication (future)

## Environment Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fusion_db
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend
Environment variables are loaded at runtime from `public/env.js`:
```javascript
window.__ENV = {
  VITE_API_BASE_URL: 'http://localhost:5000'
};
```

## Deployment

### Using Docker
```bash
docker-compose -f config/docker-compose.yml up -d
```

### Manual Deployment
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

See `READMEs/DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## Design System

### FUSO Brand Colors
- **Black**: #000000 (max 30% usage)
- **Red**: #E60000 (max 10% usage, primary action buttons)
- **Light Grey**: #f5f5f7 (min 60% usage, backgrounds)

### Button Guidelines
- All primary action buttons must use Red (#E60000)
- Secondary buttons use Light Grey with Black text
- Hover states: slight opacity change

## Documentation

All documentation is located in the `/READMEs` folder:

- `PROJECT_OVERVIEW.md` - Project overview and architecture
- `BACKEND_DOCUMENTATION.md` - Backend API documentation
- `FRONTEND_DOCUMENTATION.md` - Frontend component documentation
- `INTEGRATION_GUIDE.md` - Integration instructions
- `CREATE_FORM_PATTERN.md` - Form component patterns
- `BACKEND_COMPLETE.md` - Backend implementation details
- `JIVE_FORMAT_INTEGRATION.md` - Jive format support

## Contributing

1. Follow the existing code structure
2. Use the services layer for API calls
3. Never use Supabase - PostgreSQL only
4. Maintain FUSO brand color guidelines
5. Test all changes before committing

## License

ISC - MFTBC Development Team

## Support

For issues or questions, please refer to the documentation in `/READMEs` or contact the development team.
