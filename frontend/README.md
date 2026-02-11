# Frontend – Tiger Analytics Case Study

This is the frontend application for the Tiger Analytics case study.  
It provides a user interface for authentication, image upload, and result visualization.

---

## 🛠 Tech Stack

- Angular
- TypeScript
- HTML5 / CSS3
- Angular Material
- REST API Integration

---

## 📂 Project Structure

frontend/
├── src/
│ ├── app/
│ │ ├── core/
| | | ├──guards
| | | ├──Services
│ │ ├── pages/
| | |  ├──auth
| | |  ├──dashboard
| | |  ├──pricing
| | |  ├──stores
| | |  ├──users
│ ├── assets/
│ └── environments/
├── angular.json
├── package.json
└── README.md


---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/praveenra/TigerAnalyticsCaseStudy1.git
cd TigerAnalyticsCaseStudy1/frontend

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Environment Configuration
src/environments/environment.ts

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/',
};

### 4️⃣ Run the Application
ng serve 

Server will start at: http://localhost:4200