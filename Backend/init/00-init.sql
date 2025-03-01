-- Use the database marchMadness
-- Create the schema and tables for the marchMadness database
-- Create the data_store table to store the data
-- Create the update_updated_at_column function to update the updated_at column

DROP SCHEMA IF EXISTS "marchMadness" CASCADE;
CREATE SCHEMA "marchMadness";
GRANT ALL ON SCHEMA "marchMadness" TO root;
GRANT ALL ON SCHEMA "marchMadness" TO PUBLIC;

CREATE SCHEMA IF NOT EXISTS "marchMadness";

-- Table Definition
CREATE TABLE IF NOT EXISTS "marchMadness"."data_store" (
    "datapath" varchar(255) PRIMARY KEY,
    "data" JSONB NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_data_store_updated_at
    BEFORE UPDATE ON "marchMadness"."data_store"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
