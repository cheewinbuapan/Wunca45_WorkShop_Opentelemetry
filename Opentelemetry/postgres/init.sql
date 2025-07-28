-- Create the database user
CREATE USER grafana WITH PASSWORD 'grafana';

-- Create the database
CREATE DATABASE grafana WITH OWNER grafana;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE grafana TO grafana;
