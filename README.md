🏢 Multi-Tenant Inventory Management System

A SaaS-based inventory management platform built with the MERN stack that supports multiple businesses (tenants) with complete data isolation.

Each tenant can manage:

Products with variants

Suppliers

Purchase Orders

Stock movements

Smart low-stock alerts

Inventory analytics dashboard

🚀 Tech Stack
Backend

Node.js

Express

TypeScript

MongoDB (Atlas)

Mongoose

JWT Authentication

MongoDB Transactions

Frontend

React + TypeScript
React Router
Context API
Recharts (Dashboard)
Lucide Icons
Axios
TailwindCSS

🔐 Core Features
✅ Multi-Tenant Architecture

Row-level tenant isolation

tenantId enforced in all queries

Indexed for performance

✅ Role-Based Access Control

OWNER

MANAGER

STAFF

Permissions:

OWNER / MANAGER → create/update inventory

STAFF → read-only access

✅ Complex Inventory

Products with multiple variants (SKU-based)

Variant-level stock tracking

Low stock threshold per variant

Atomic stock deduction

Concurrency-safe updates

✅ Stock Movement Tracking

Tracks:

SALE

PURCHASE

RETURN

ADJUSTMENT

Provides full audit history.

✅ Purchase Orders

Lifecycle: DRAFT → SENT → CONFIRMED → RECEIVED

Partial receiving supported

Auto stock increment on receiving

Transaction-safe updates

✅ Smart Low-Stock Alerts

Considers:

Current stock

Confirmed incoming Purchase Orders

Prevents false alerts.

✅ Dashboard & Analytics

Total inventory value

Top 5 sellers (last 30 days)

7-day stock movement graph

Optimized using aggregation pipelines

🛠 Setup Instructions

1️⃣ Clone Repository

git clone <repo-url>
cd inventory-saas

2️⃣ Backend Setup

cd backend
npm install
npm run dev

3️⃣ Frontend Setup

cd ../frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173

Frontend Environment (.env.local)

VITE_API_BASE_URL=http://localhost:5000/api

Server runs at:

http://localhost:5000

🧪 Test Credentials
Tenant: Alpha Store

OWNER

owner@alpha.com
password123

MANAGER

manager@alpha.com
password123

STAFF

staff@alpha.com
password123

Tenant: Beta Mart

OWNER

owner@beta.com
password123

STAFF

staff@beta.com
password123

🧠 Key Engineering Decisions

Row-level tenant isolation for scalability

Embedded variant modeling for atomic stock updates

Conditional MongoDB updates to prevent negative stock

MongoDB transactions for consistency

Aggregation pipelines for analytics

Indexed tenantId for performance

See ARCHITECTURE.md for full explanation.

📊 Performance Considerations

Indexed frequently filtered fields

Used lean queries where applicable

Aggregation pipelines for heavy calculations

Tenant-based filtering for scalability

System designed to handle 10,000+ products efficiently.

⚠️ Assumptions

Each tenant operates independently

Variants are embedded within products

Only CONFIRMED POs count toward incoming stock

MongoDB transactions available (Replica Set / Atlas)

🚧 Known Limitations

No background job queue

No caching layer

No soft delete implementation

No advanced search/filtering

No automated test suite implemented yet

Limited input validation layer

🛣 Future Improvements

Redis caching for dashboard

Background workers for alerts

Soft delete with audit logs

Real-time stock updates via Socket.io

Dockerized deployment

CI/CD integration

Advanced pagination & filtering

⏱ Time Breakdown
Task Approx Time
Backend setup & auth 3 hrs
Product & stock system 4 hrs
Purchase order system 4 hrs
Smart low-stock logic 2 hrs
Dashboard analytics 3 hrs
Documentation 2 hrs
📌 Conclusion

This project demonstrates:

Secure multi-tenant SaaS architecture

Real-world inventory logic

Concurrency-safe stock handling

Transactional data integrity

Performance-focused query design

Designed with scalability and clarity in mind.
