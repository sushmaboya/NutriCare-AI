# NutriCare AI - Full-Stack Personalized Healthcare & Nutritional Recommendation System

An advanced clinical healthcare and nutritional dietician application built with a React.js frontend, Node.js + Express backend, MongoDB database, and OpenAI GPT integration.

---

## Key Features

1. **User Authentication & Session Management**: Secure registration and login flow utilizing JWT authentication, with session persistence across refresh.
2. **Clinical Health Profiler**: Interactive forms logging age, gender, height, and weight with automated real-time BMI index tracking and status classifications.
3. **Clinical Recommendation Engine**: Algorithmic rules mapping five key deficiencies (Iron, Vitamin, Protein, Calcium, Vitamin D) and five chronic conditions (Diabetes, High BP, Cholesterol, Kidney Disease, Thyroid) to priority foods and contraindications to avoid.
4. **Daily Indian Meal Scheduler**: Synthesizes a structured 4-meal daily menu (Breakfast, Lunch, Dinner, Snack) containing precise calorie sums and macro distributions matching user fitness targets.
5. **Interactive Food portion Calculator**: Grams-based food diary allowing users to search local foods and total macro/micronutrients cumulative values.
6. **AI Consult Chatbot**: Integrates OpenAI API for full conversational nutrition assessments, with an automated fallback to a local smart recommendation engine if no API key is set.
7. **Premium Responsive UX**: Responsive high-fidelity dashboard containing BMI visual scales, progress bars, dark/light theme, and skeletons.

---

## Folder Structure

```
├── backend/            # Express REST API, Mongoose Models & Controller routes
├── frontend/           # React SPA, Axios services, Tailwind theme layouts
├── docker/             # Production multi-stage Dockerfiles and Nginx configs
├── jenkins/            # Jenkinsfile declarative CI/CD pipeline
├── docs/               # System architecture and setup instruction manuals
├── docker-compose.yml  # Multi-container local execution orchestrator
└── README.md
```

---

## Launch & Setup Directions

For launch details, database seeding, and verification, please refer to:
* 📖 **[Local Setup & Seeding Guide](file:///c:/Users/sushm/OneDrive/Desktop/devops%20sem-6/docs/setup.md)**
* 📖 **[System Architecture Blueprint](file:///c:/Users/sushm/OneDrive/Desktop/devops%20sem-6/docs/architecture.md)**

### Direct Commands Summary:

#### Run via Docker:
```bash
docker-compose up --build -d
```

#### Run Locally (Dev Mode):
1. **Backend**:
   ```bash
   cd backend && npm install && npm run seed && npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend && npm install && npm run dev
   ```
