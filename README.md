# Growth & Inclusion Aid (GIA) HUB

The **Growth & Inclusion Aid (GIA) HUB** is a high-end, database-driven NGO beneficiary management platform. It is designed to track aid disbursements, verify beneficiary documents, and detect potential fraud using an advanced **"Antigravity Glassmorphism"** dashboard.

## Tech Stack
* **Backend:** Node.js, Express, MySQL (mysql2 promise-based)
* **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide-React
* **Design System:** Custom "Antigravity Glass" using dynamic floating elements, backdrop blurs, and neon color accents.

## Core Features
1. **Command Center:** Real-time metrics and Recharts visualizations overviewing platform health.
2. **Beneficiary Directory:** Grid view with progressive data disclosure on hover.
3. **Verification Pipeline:** Interactive Kanban board for application review and a fraud risk scatter-plot.
4. **Grant & Finance Hub:** Aggregate tracking of project funding with hover-reveal capacity progress bars.
5. **Intelligence & Logs:** Real-time event stream mapping automated fraud rules and queries.

## Getting Started

### Prerequisites
* Node.js (v18+)
* MySQL server
* Set up a `gia_hub` database locally and import your SQL schema.

### Backend Setup
```bash
cd server
npm install
# configure DB inside config/db.js to point to your local MySQL
npm start
```
*Backend defaults to port 5001 to prevent conflicts.*

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Frontend defaults to port 5173.*
