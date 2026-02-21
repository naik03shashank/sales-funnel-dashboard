-- ========================================================
-- SALES FUNNEL CONVERSION DASHBOARD - SQL DATA PACK
-- ========================================================
-- This script contains:
-- 1. Database & Table Setup
-- 2. Sample Data Insertion
-- 3. Core Analytical Queries for Power BI
-- ========================================================

-- 1. DATABASE SETUP
CREATE DATABASE IF NOT EXISTS sales_bi_db;
USE sales_bi_db;

CREATE TABLE IF NOT EXISTS sales_pipeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    status ENUM('Lead', 'Opportunity', 'Win', 'Lost') DEFAULT 'Lead',
    lead_date DATE NOT NULL,
    opportunity_date DATE,
    win_date DATE,
    deal_value DECIMAL(15, 2) DEFAULT 0.00
);

-- 2. SAMPLE DATA
INSERT INTO sales_pipeline (lead_name, region, status, lead_date, opportunity_date, win_date, deal_value) VALUES
('Tech Corp', 'North America', 'Win', '2025-01-10', '2025-01-15', '2025-02-01', 50000.00),
('Global Soft', 'Europe', 'Win', '2025-01-12', '2025-01-20', '2025-02-05', 75000.00),
('Data Systems', 'Asia', 'Opportunity', '2025-01-15', '2025-01-25', NULL, 30000.00),
('Innovate LLC', 'North America', 'Opportunity', '2025-01-18', '2025-02-01', NULL, 25000.00),
('Smart Solutions', 'Europe', 'Lead', '2025-02-01', NULL, NULL, 15000.00),
('Future Tech', 'Asia', 'Lost', '2025-01-05', '2025-01-10', NULL, 40000.00),
('Elite Services', 'North America', 'Win', '2025-01-20', '2025-01-25', '2025-02-10', 60000.00),
('Dynamic Inc', 'Europe', 'Lead', '2025-02-05', NULL, NULL, 20000.00),
('Nexus Ltd', 'Asia', 'Win', '2025-01-22', '2025-02-01', '2025-02-15', 55000.00),
('Cloud Nine', 'North America', 'Opportunity', '2025-02-01', '2025-02-10', NULL, 35000.00),
('Apex Corp', 'Europe', 'Opportunity', '2025-02-02', '2025-02-12', NULL, 45000.00),
('Core Biz', 'Asia', 'Lead', '2025-02-10', NULL, NULL, 10000.00),
('Zenith Group', 'North America', 'Win', '2025-01-05', '2025-01-12', '2025-01-25', 90000.00),
('Alpha Parts', 'Europe', 'Win', '2025-01-08', '2025-01-18', '2025-01-30', 65000.00),
('Beta Motors', 'Asia', 'Opportunity', '2025-01-15', '2025-01-28', NULL, 32000.00);

-- 3. ANALYTICAL QUERIES FOR DASHBOARD

-- Query A: Funnel Volume Data
-- Used for the Funnel Chart visual
SELECT 
    'Leads' as stage,
    COUNT(id) as volume,
    SUM(deal_value) as potential_revenue
FROM sales_pipeline
UNION ALL
SELECT 
    'Opportunities' as stage,
    COUNT(id) as volume,
    SUM(deal_value) as potential_revenue
FROM sales_pipeline
WHERE opportunity_date IS NOT NULL
UNION ALL
SELECT 
    'Wins' as stage,
    COUNT(id) as volume,
    SUM(deal_value) as potential_revenue
FROM sales_pipeline
WHERE win_date IS NOT NULL;

-- Query B: Region Wise Conversion Breakdown
SELECT 
    region,
    COUNT(id) as Total_Leads,
    COUNT(opportunity_date) as Total_Opportunities,
    COUNT(win_date) as Total_Wins,
    ROUND((COUNT(opportunity_date) / COUNT(id)) * 100, 2) as Lead_to_Opp_Rate,
    ROUND((COUNT(win_date) / NULLIF(COUNT(opportunity_date), 0)) * 100, 2) as Opp_to_Win_Rate
FROM sales_pipeline
GROUP BY region;

-- Query C: Monthly Revenue Trend
SELECT 
    DATE_FORMAT(lead_date, '%Y-%m') as Month,
    SUM(CASE WHEN status = 'Win' THEN deal_value ELSE 0 END) as Actual_Revenue,
    COUNT(id) as Lead_Volume
FROM sales_pipeline
GROUP BY Month
ORDER BY Month;
