-- SQL Script for Power BI Data Extraction
-- This script provides the aggregated data needed for the funnel and trend visualizations.

-- 1. Main Funnel Data Extraction
-- Extracts counts of Leads, Opportunities, and Wins by Region and Date
SELECT 
    region,
    lead_date as activity_date,
    'Lead' as stage,
    COUNT(id) as count,
    SUM(deal_value) as potential_value
FROM sales_pipeline
GROUP BY region, lead_date

UNION ALL

SELECT 
    region,
    opportunity_date as activity_date,
    'Opportunity' as stage,
    COUNT(id) as count,
    SUM(deal_value) as potential_value
FROM sales_pipeline
WHERE opportunity_date IS NOT NULL
GROUP BY region, opportunity_date

UNION ALL

SELECT 
    region,
    win_date as activity_date,
    'Win' as stage,
    COUNT(id) as count,
    SUM(deal_value) as potential_value
FROM sales_pipeline
WHERE win_date IS NOT NULL
GROUP BY region, win_date;

-- 2. Conversion Rate Calculation (Example for Power BI DAX or SQL View)
-- While Power BI prefers DAX for conversion rates, here is a SQL approach for periodic reporting
CREATE OR REPLACE VIEW conversion_metrics AS
SELECT 
    region,
    COUNT(id) as Total_Leads,
    COUNT(opportunity_date) as Total_Opportunities,
    COUNT(win_date) as Total_Wins,
    (COUNT(opportunity_date) / COUNT(id)) * 100 as Lead_to_Opp_Rate,
    (COUNT(win_date) / NULLIF(COUNT(opportunity_date), 0)) * 100 as Opp_to_Win_Rate,
    (COUNT(win_date) / COUNT(id)) * 100 as Lead_to_Win_Rate
FROM sales_pipeline
GROUP BY region;

-- 3. Trend Data
SELECT 
    DATE_FORMAT(lead_date, '%Y-%m') as Month,
    region,
    COUNT(id) as New_Leads,
    COUNT(win_date) as New_Wins,
    SUM(CASE WHEN status = 'Win' THEN deal_value ELSE 0 END) as Revenue
FROM sales_pipeline
GROUP BY Month, region
ORDER BY Month ASC;
