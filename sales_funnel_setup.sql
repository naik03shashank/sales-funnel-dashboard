-- Create Database
CREATE DATABASE IF NOT EXISTS sales_tracking;
USE sales_tracking;

-- Create Table for Sales Pipeline
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

-- Insert Sample Data
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
