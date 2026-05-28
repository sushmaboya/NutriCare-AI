# Local Setup & Launch Guidelines

This document provides complete instructions for seeding the database and launching both the frontend and backend of the NutriCare AI platform.

---

## Technical Prerequisites
- **Node.js**: v18.x or above (v20+ recommended)
- **MongoDB**: A running local MongoDB instance on standard port `27017` (e.g. `mongodb://127.0.0.1:27017/healthcare`) OR Docker installed.

---

## Method A: Quick Start via Docker Compose (Recommended)

1. Navigate to the root workspace directory:
   ```bash
   cd "c:\Users\sushm\OneDrive\Desktop\devops sem-6"
   ```
2. Build and launch all three containers (MongoDB, Express API, React SPA):
   ```bash
   docker-compose up --build -d
   ```
3. Once running, open your web browser:
   * Frontend Application: [http://localhost](http://localhost) (Port 80 via Nginx)
   * Backend API Server: [http://localhost:5000](http://localhost:5000)
4. (Optional) Run the database seeding command inside the running backend container to immediately pre-seed Indian food values:
   ```bash
   docker exec -it nutricare-backend npm run seed
   ```

---

## Method B: Manual Local Development Launch

### 1. Launch Backend Service

1. Open a new terminal in the backend directory:
   ```bash
   cd backend
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   - (Ensure `MONGODB_URI` points to your running local MongoDB: `mongodb://127.0.0.1:27017/healthcare`).
   - (Provide your `OPENAI_API_KEY` if utilizing GPT-4 nutritionist consults. If blank, local intelligent rules will auto-run).
4. Run the data seeder to import standard food macros (Paneer, Roti, Spinach, Dal, Eggs, Chicken, etc.):
   ```bash
   npm run seed
   ```
5. Launch the Express server in hot-reload development mode:
   ```bash
   npm run dev
   ```
   * The server launches at `http://localhost:5000`.

### 2. Launch Frontend SPA

1. Open a new terminal in the frontend directory:
   ```bash
   cd frontend
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Start the Vite single-page application dev server:
   ```bash
   npm run dev
   ```
4. Access the web interface in your browser:
   * [http://localhost:5173](http://localhost:5173) (Standard Vite port).

---

## Basic User Journey Test Walkthrough
1. **Register**: Go to `/register` and create an account.
2. **Onboarding**: Fill in your age, gender, height (e.g., `175` cm), and weight (e.g., `80` kg). Note the auto-computed BMI badge dynamically shifting to "Overweight". Select "Protein deficiency" and "Diabetes" as clinical targets. Save.
3. **Dashboard Analysis**: Confirm you are redirected. Review your custom caloric target, macronutrient bars, health insights explaining thyroid and insulin controls, and deficiency lists recommending chickpeas and eggs while warning you to avoid white rice.
4. **Nutrition Journal**: Click "Nutrition Calculator", search "Roti" and add 120g. Search "Curd" and add 150g. Notice the aggregated total calories and protein gauges update.
5. **AI Consult**: Open the Chat interface. Send: *"What high protein snacks should I eat for my protein deficiency while managing diabetes?"*. Notice the response specifically targets clinical parameters.
