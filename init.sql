CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(255),
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    testing_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    proficiency_level VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    achievements_json JSON
);

CREATE TABLE IF NOT EXISTS ai_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_query TEXT NOT NULL,
    generated_sql TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO projects (title, description, tech_stack, github_url, live_url, testing_status) VALUES
('AI Crypto Dashboard', 'A real-time dashboard tracking crypto volatility using Gemini AI.', 'React, TypeScript, Node.js, Socket.io', 'https://github.com/example/crypto-dash', 'https://crypto-dash.example.com', 'Done'),
('O-Auth Gateway Microservice', 'A secure standalone server managing OAuth2 handshakes.', 'Express, JWT, Redis, MongoDB', 'https://github.com/example/oauth-gateway', 'None', 'In Progress');

INSERT INTO skills (name, category, proficiency_level) VALUES
('React', 'Frontend', 'Expert'),
('Tailwind CSS', 'Frontend', 'Expert'),
('Node.js', 'Backend', 'Advanced'),
('MySQL', 'Database', 'Advanced'),
('TypeScript', 'Language', 'Expert');

INSERT INTO experience (role, company, duration, achievements_json) VALUES
('Senior Full-Stack Engineer', 'Acme Corp', '2020 - Present', '["Led migration to TS", "Optimized DB queries by 40%", "Designed GraphQL layer"]'),
('Web Developer', 'Startup Inc', '2018 - 2020', '["Built MVP in React", "Integrated Stripe", "Dockerized app"]');
