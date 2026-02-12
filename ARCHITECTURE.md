Multi-Tenant Inventory Management System
Architecture & Design Decisions

1. System Overview

This project implements a multi-tenant SaaS-based inventory management system built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript on the backend.

The system supports:

Multi-tenant isolation

Role-based access control

Variant-level inventory tracking

Concurrency-safe stock deduction

Purchase order lifecycle management

Smart low-stock alerts

Real-time inventory analytics

The architecture prioritizes:

Data integrity

Tenant isolation

Scalability

Clear separation of concerns

Real-world business logic handling

## 2. Multi-Tenancy Architecture

### Chosen Strategy: Row-Level Isolation

Each collection contains a tenantId field:

tenantId: ObjectId

All queries enforce tenant isolation:

{ tenantId: req.user.tenantId }

Why Row-Level Isolation?
Advantages

Single database (simpler deployment)

Lower infrastructure cost

Easier scaling

Works efficiently with MongoDB indexing

Suitable for small-to-mid SaaS systems

Trade-offs

Risk of data leakage if tenant filter is forgotten

Mitigation Strategy

Every service enforces tenantId in queries

tenantId indexed in all major collections

Update and delete operations also scoped by tenant

Why Not Separate Database Per Tenant?

Although separate databases provide stronger isolation:

Increased connection management complexity

Harder scaling

Not cost-effective for early-stage SaaS

Complicates analytics

Given assignment scope, row-level isolation is the most practical and scalable approach.

## 3. Authentication & Authorization

### Authentication

JWT-based authentication

Token contains:

userId

role

tenantId

Example token payload:

{
id,
role,
tenantId
}

This avoids repeated database lookups for tenant context.

Role-Based Access Control (RBAC)

Roles supported:

OWNER

MANAGER

STAFF

Authorization enforced using middleware:

OWNER / MANAGER: Can create products, suppliers, purchase orders

STAFF: Read-only access

RBAC is implemented at route level using middleware for clear separation of concerns.

## 4. Product & Variant Modeling

Design Decision: Embedded Variants
Product {
tenantId,
name,
variants: [
{
sku,
attributes,
price,
stock,
lowStockThreshold
}
]
}

Why Embedded Variants?

Variants are tightly coupled to products

Enables atomic stock updates

Reduces need for joins

Improves write performance

Simplifies transactional logic

Trade-offs

Larger product document size

Entire document updated during stock modification

Mitigation:

Variant counts typically small (< 50)

Acceptable within MongoDB document limits

## 5. Concurrency Handling Strategy

Problem

Simultaneous purchase of limited stock may cause negative inventory.

Solution: Conditional Atomic Updates
await Product.findOneAndUpdate(
{
\_id: productId,
tenantId,
"variants.\_id": variantId,
"variants.stock": { $gte: quantity }
  },
  {
    $inc: { "variants.$.stock": -quantity }
}
);

Why This Works

MongoDB guarantees document-level atomicity

Update succeeds only if sufficient stock exists

Prevents negative stock

Eliminates race conditions without locks

## 6. Transaction Management

MongoDB transactions are used for:

Stock deduction + StockMovement creation

Purchase order receiving + stock increment

Ensures:

All operations succeed together

Or rollback entirely

This guarantees data consistency.

## 7. Stock Movement Strategy

Separate StockMovement collection used to track all inventory changes.

StockMovement {
tenantId,
productId,
variantId,
type,
quantity,
createdAt
}

Benefits

Complete audit trail

Enables analytics

Supports dashboard graphs

Debugging and reconciliation

Financial reporting

Design principle:

Current stock = balance
StockMovement = transaction history

## 8. Purchase Order Design

Lifecycle
DRAFT → SENT → CONFIRMED → RECEIVED

Partial Receiving

Each item tracks:

orderedQty
receivedQty

Supports partial deliveries.

Receiving Logic

When receiving items:

Increment product stock

Update receivedQty

Create StockMovement entries

Use transaction for atomicity

Update status to RECEIVED when fully received

## 9. Smart Low-Stock Alerts

Effective stock calculation:

effectiveStock =
currentStock +
(orderedQty - receivedQty from CONFIRMED POs)

Only CONFIRMED POs are considered reliable incoming stock.

This prevents false low-stock alerts.

## 10. Dashboard & Analytics

## Inventory Value

Calculated using MongoDB aggregation:

$unwind variants
$group with $multiply(stock × price)

Avoids heavy in-memory loops.

Top 5 Sellers (Last 30 Days)

Aggregation on StockMovement:

Filter by tenantId

Filter by type = SALE

Group by product + variant

Sort by quantity

Limit 5

Stock Movement Graph (7 Days)

Aggregation grouped by date:

year

month

day

Optimized for chart rendering.

## 11. Performance Optimization

## Indexing Strategy

Indexes created on:

tenantId (all major collections)

tenantId + status (PurchaseOrder)

tenantId + createdAt (StockMovement)

tenantId + variants.sku (Product)

Lean Queries

Used .lean() where document methods were not required to reduce Mongoose overhead.

## 12. Scalability Considerations

With more time or production scaling:

Sharding by tenantId

Redis caching for dashboard

Background job processing for alerts

Soft delete strategy

API rate limiting

Request validation middleware

Pagination & filtering

CI/CD integration

Dockerization

## 13. Security Considerations

- JWT-based authentication with expiration
- Role-based access middleware
- Tenant isolation enforced at service level
- Sensitive configuration stored in environment variables
- No business logic trusted from frontend

## 14. Trade-offs Made

    Decision Trade-off Reason
    Embedded variants Larger documents Atomic updates
    Row-level isolation Requires strict filtering Simpler deployment
    No caching layer Slightly slower analytics Reduced complexity
    No background workers Real-time computation Simplicity for assignment

## 15. Conclusion

This system demonstrates:

Secure multi-tenant architecture

Concurrency-safe inventory management

Transactional data integrity

Smart business logic implementation

Performance-conscious query design

Scalable SaaS-ready foundation

The design balances correctness, clarity, and scalability while prioritizing real-world inventory requirements

## 16. Frontend Architecture

The frontend is built using React with TypeScript.

Key architectural principles:

- Component-based modular structure
- Centralized API helper layer
- Route constants management
- Reusable UI components (Modals, Pagination, Tables)
- Controlled forms with strict type safety
- Clean separation of layout and content
- Scroll isolation handling
- Dynamic navigation highlighting

API communication is centralized using Axios instance with environment-based base URL.

All business logic is handled server-side.
Frontend focuses on presentation and state management.

## 17. Deployment Strategy

Backend: Deployable on Render / Railway / AWS
Frontend: Deployable on Vercel / Netlify

Environment variables managed via platform config.

MongoDB Atlas used for cloud database.

JWT secret stored securely in environment variables.
