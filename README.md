# URL Shortener

A full-stack URL shortener with authentication, OTP verification, and per-user URL management.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas

## Project Structure
- `frontend/` React app
- `backend/` Express API

## Production Notes
- Signup requires working email/SMTP environment variables because OTP verification is mandatory.
- Set `PUBLIC_BASE_URL` in backend so generated short links use your deployed domain.
- Set `CORS_ORIGINS` in backend to your frontend domain(s), comma-separated.

## Local Setup
1. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```
2. Configure env files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
3. Run backend:
```bash
cd backend
npm run dev
```
4. Run frontend:
```bash
cd frontend
npm run dev
```

## Build Frontend
```bash
cd frontend
npm run build
```

## API Base
- Auth routes: `/api/auth/*`
- URL routes: `/api/url/*`
- Health check: `/health`