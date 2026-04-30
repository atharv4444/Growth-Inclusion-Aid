# GIA HUB - Growth & Inclusion Aid

GIA HUB is a full-stack web application designed for non-governmental organizations (NGOs) to manage beneficiaries, process grant applications, track disbursements, and identify potential fraud using a robust automated system. 

This repository contains the complete codebase, rebuilt with a modern, high-performance tech stack.

## Architecture & Tech Stack

### Frontend (Client)
- **Framework:** React 19 (powered by Vite)
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion
- **Icons:** Lucide-React
- **Data Visualization:** Recharts
- **HTTP Client:** Axios
- **Design System:** A premium, light-themed administrative dashboard utilizing a hybrid typography system (Playfair Display & Inter).

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Connection:** `mysql2/promise` (Connection Pooling)

## Features & Modules

1. **Command Center:** Live dashboard with animated KPI cards, fund allocation charts, and application flow graphs.
2. **Beneficiary Directory:** Searchable table of all aid recipients. Includes slide-in panels to seamlessly add new beneficiaries and apply for grants on their behalf.
3. **Verification Pipeline:** Interactive Kanban-style board (Under Review, Approved, Rejected). Supports inline approval, rejection, and fraud-flagging.
4. **Grant & Finance Hub:** Management of active grant programs, budget allocation tracking with dynamic progress bars, and a form to define new grants.
5. **Intelligence Logs:** Automated fraud detection and administrative event stream with paginated views and manual override capabilities.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server

### Database Setup
1. Ensure MySQL is running on your machine.
2. Create a database named `gia_hub`:
   ```sql
   CREATE DATABASE gia_hub;
   ```
3. Load the initial schema and rich dummy data using the provided seed file:
   ```bash
   mysql -u root -p gia_hub < seed.sql
   ```
4. Configure your database credentials in `server/config/db.js`.

### Running the Application

**1. Start the Backend Server**
```bash
cd server
npm install
npm start
```
*The API will run on `http://localhost:5001`*

**2. Start the Frontend Application**
```bash
cd client
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173` and proxies API requests to the backend.*

## Recent Updates
- Complete frontend overhaul from legacy dark-mode to a structured, light-themed admin dashboard.
- Full integration with live MySQL data (zero hardcoded values).
- Interactive forms for adding beneficiaries and grant programs.
- Paginated intelligence logs and inline Kanban board actions.
