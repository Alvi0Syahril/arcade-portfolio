-- Seeding the Portfolio with its own development history
INSERT INTO projects (title, description, tech_stack, github_url, live_url, testing_status) VALUES 
('Interactive Arcade Portfolio V2', 'A high-performance React playground featuring a Matter.js physics engine, a dual-mode AI agent, and a secured PostgreSQL backend. Built iteratively over 15 days of intensive full-stack development.', 'React, Matter.js, TailwindCSS, Node.js, PostgreSQL, Google Gemini AI', 'https://github.com/Alvi0Syahril', 'http://localhost:5173', 'Verified & Secure');

INSERT INTO skills (name, category, proficiency_level) VALUES 
('React & Framer Motion', 'Frontend', 'Expert'),
('Node.js & Express', 'Backend', 'Advanced'),
('PostgreSQL', 'Database', 'Expert'),
('Matter.js Physics', 'Animation', 'Advanced'),
('Google Gemini AI Integration', 'AI/ML', 'Expert'),
('Zero-Trust Security (Helmet/Rate-Limit)', 'Security', 'Advanced');

INSERT INTO experience (role, company, duration, achievements_json) VALUES 
('Full-Stack Developer & AI Architect', 'Freelance / Portfolio Project', 'April 2026 (15 Days)', '["Migrated full stack from MySQL to PostgreSQL", "Implemented zero-trust SQL sanitization layer", "Built physics-driven arcade UI with Matter.js", "Integrated dual-mode Gemini AI for portfolio queries"]');
