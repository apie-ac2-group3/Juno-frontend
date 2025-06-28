# Juno Frontend - Custom Backend Integration

This frontend has been migrated from Supabase to work with the custom FastAPI backend located in `../Juno-backend/`.

## Changes Made

### Removed
- All Supabase dependencies and configuration
- Supabase Edge Functions (sentiment analysis, AI chat)
- Supabase authentication system
- Supabase database integration

### Added
- Custom API client (`src/api/client.ts`) for FastAPI backend
- Local authentication using session tokens
- Simple local sentiment analysis (basic keyword matching)
- Updated AI chat with local responses

## Backend API Integration

The frontend now connects to these FastAPI backend endpoints:

- `POST /login/register` - User registration
- `POST /login` - User login (Basic Auth)
- `GET /journals` - Get user's journal entries (Bearer Auth)
- `POST /journals` - Create new journal entry (Bearer Auth) 
- `PUT /journals/{id}` - Update journal entry (Bearer Auth)
- `DELETE /journals/{id}` - Delete journal entry (Bearer Auth)

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../Juno-backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # or if using uv:
   uv sync
   ```

3. Set up the database:
   ```bash
   python -m app.create_db
   ```

4. Start the backend server:
   ```bash
   fastapi dev
   # or
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## API Client Usage

The API client is available as a singleton:

```typescript
import { apiClient } from '@/api/client';

// Authentication
await apiClient.login(email, password);
await apiClient.register(name, email, password);
await apiClient.logout();

// Journal operations
const journals = await apiClient.getJournals();
const newJournal = await apiClient.createJournal();
const updated = await apiClient.updateJournal(id, content);
await apiClient.deleteJournal(id);
```

## Authentication Flow

1. User logs in through the SignIn page
2. Backend returns a session token via Basic Auth
3. Token is stored in localStorage
4. All subsequent requests use Bearer token authentication

## Features

### Working
- ✅ User registration and login
- ✅ Journal entry creation, editing, deletion
- ✅ Basic local sentiment analysis
- ✅ Simple AI chat with predefined responses
- ✅ Responsive UI with mood selection

### Removed/Simplified
- ❌ Supabase OAuth (Google login)
- ❌ Advanced AI sentiment analysis via Edge Functions
- ❌ Real AI chat via Gemini
- ❌ Email verification
- ❌ Real-time features

## Development

To make changes:

1. Update API client in `src/api/client.ts` for new backend endpoints
2. Modify hooks in `src/hooks/` for data fetching logic
3. Update components as needed

## Notes

- The sentiment analysis is now local and basic (keyword matching)
- AI chat provides predefined responses instead of real AI
- Authentication is session-based, not JWT-based
- No real-time features (all data fetched on page load)

This migration maintains the core journaling functionality while removing the dependency on Supabase services. 