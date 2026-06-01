CREATE DATABASE NASA;
USE NASA;

-- Table 1: Locations where meteors have been found or observed
CREATE TABLE locations (
    location_id  INTEGER      PRIMARY KEY AUTOINCREMENT,
    name         VARCHAR(100) NOT NULL,
    country      VARCHAR(100) NOT NULL,
    latitude     DECIMAL(8,5),
    longitude    DECIMAL(8,5)
);

-- Table 2: Individual meteor impact records
CREATE TABLE impacts (
    impact_id      INTEGER      PRIMARY KEY AUTOINCREMENT,
    location_id    INTEGER      NOT NULL REFERENCES locations(location_id),
    name           VARCHAR(150) NOT NULL,
    year           INTEGER,
    mass_kg        DECIMAL(15,3),
    classification VARCHAR(50),
    was_observed   BOOLEAN      NOT NULL DEFAULT FALSE
);

-- Index for common lookup by location
CREATE INDEX idx_impacts_location ON impacts(location_id);

-- Sample data: locations
INSERT INTO locations (name, country, latitude, longitude) VALUES
    ('Barringer Crater', 'United States',  35.02694, -111.02278),
    ('Chicxulub',        'Mexico',         21.30000,  -89.51667),
    ('Willamette',       'United States',  45.41667, -122.66667);

-- Sample data: impacts
INSERT INTO impacts (location_id, name, year, mass_kg, classification, was_observed) VALUES
    (1, 'Canyon Diablo',    -50000,    18143.0, 'IAB iron',       FALSE),
    (2, 'Chicxulub impactor', -66000000, NULL,  'Chondrite',      FALSE),
    (3, 'Willamette Meteorite', 1902,   15500.0, 'Iron ungrouped', FALSE);