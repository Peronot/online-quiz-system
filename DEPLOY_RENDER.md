# Deploy Online (Render)

This project is prepared for Render with:
- `render.yaml` (frontend + backend + PostgreSQL)
- `backend/Dockerfile`
- `backend/start.sh`

## 1) Push latest code to GitHub

```bash
git add .
git commit -m "Prepare Render deployment"
git push
```

## 2) Create Render Blueprint

1. Open Render dashboard.
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repo: `online-quiz-system`.
4. Render will detect `render.yaml` and create:
   - `online-quiz-backend` (Docker web service)
   - `online-quiz-frontend` (Static site)
   - `online-quiz-db` (PostgreSQL)

## 3) Set required env vars (important)

After services are created:

### Backend env vars
- `APP_URL` = your backend URL (example: `https://online-quiz-backend.onrender.com`)
- `CORS_ALLOWED_ORIGINS` = your frontend URL (example: `https://online-quiz-frontend.onrender.com`)

### Frontend env vars
- `VITE_API_BASE_URL` = backend API URL + `/api`
  - Example: `https://online-quiz-backend.onrender.com/api`

Then redeploy frontend after setting `VITE_API_BASE_URL`.

## 4) Verify

- Frontend opens: `https://online-quiz-frontend.onrender.com`
- Backend health: `https://online-quiz-backend.onrender.com/`
- API login test (should return validation/422, meaning API is alive):
  - `POST https://online-quiz-backend.onrender.com/api/login`

## Notes

- Backend startup runs migrations automatically (`php artisan migrate --force`).
- First deploy can take a few minutes on free plan.
