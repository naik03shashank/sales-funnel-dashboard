# Sales Funnel Conversion Dashboard

This project provides a comprehensive solution for tracking and analyzing lead conversions through a sales funnel. It includes both a high-performance **Web Interactive Dashboard** and a **MySQL/Power BI Integration Pack**.

## 🚀 Deliverables

### 1. Web Interactive Dashboard
A modern, dark-themed dashboard built with **React, Vite, and Recharts**.
- **Location:** `./dashboard`
- **Features:**
  - Real-time KPI calculations (Total Leads, Opportunities, Wins, Revenue).
  - Dynamic Conversion Funnel visualization.
  - Interactive Region and Time Period slicers.
  - Revenue & Lead activity trend graphs.
  - Responsive layout with glassmorphism effects.

**How to run locally:**
```bash
cd dashboard
npm install
npm run dev
```

### 2. SQL Data Model
A complete MySQL script to set up the database and extract structured data for analysis.
- **File:** `FINAL_SQL_DELIVERY.sql`
- **Contents:** Table schema, sample data, and optimized queries for the funnel volume, regional breakdown, and trends.

### 3. Power BI Implementation Guide
To replicate this dashboard in Power BI Desktop, use the following DAX measures:

| Metric | DAX Formula |
|--------|-------------|
| **Total Leads** | `Total Leads = COUNTROWS('sales_pipeline')` |
| **Opportunities** | `Total Opportunities = CALCULATE(COUNTROWS('sales_pipeline'), NOT(ISBLANK('sales_pipeline'[opportunity_date])))` |
| **Total Wins** | `Total Wins = CALCULATE(COUNTROWS('sales_pipeline'), 'sales_pipeline'[status] = "Win")` |
| **Conv. Rate (L2O)** | `Lead to Opp Rate = DIVIDE([Total Opportunities], [Total Leads], 0)` |
| **Win Rate** | `Opp to Win Rate = DIVIDE([Total Wins], [Total Opportunities], 0)` |
| **Total Revenue** | `Total Revenue = SUM('sales_pipeline'[deal_value])` |

---

## 📊 Dashboard Visuals Overview

1. **KPI Cards:** Top row tracking core metrics with percentage changes.
2. **Funnel Chart:** Visual representation of lead drops at each stage (Lead -> Opportunity -> Win).
3. **Trend Area Chart:** Tracking the influx of leads vs. closed revenue over time.
4. **Regional Slicer:** Allows stakeholders to drill down into specific geographic performance.
5. **Activity Feed:** Detailed list of the most recent lead transitions.

---
*Created by Antigravity AI*
