-- =====================================================
-- CSE Motors – Full Database Rebuild Script
-- CSE 340 – Web Backend Development
-- File: database/cse-motors-db.sql
--
-- Run this entire file at once in pgAdmin / SQLTools
-- to fully restore the database from scratch.
-- Order of execution:
--   1. Create ENUM type
--   2. Create tables (account, classification, inventory)
--   3. Populate classification table
--   4. Populate inventory table
--   5. Query 4 from assignment2 (Hummer description fix)
--   6. Query 6 from assignment2 (image path fix)
-- =====================================================


-- -------------------------------------------------------
-- STEP 1: Create account_type ENUM
-- -------------------------------------------------------
CREATE TYPE public.account_type AS ENUM (
  'Client',
  'Employee',
  'Admin'
);


-- -------------------------------------------------------
-- STEP 2: Create Tables
-- -------------------------------------------------------

-- account table
CREATE TABLE public.account (
  account_id       SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50)  NOT NULL,
  account_lastname  VARCHAR(50)  NOT NULL,
  account_email     VARCHAR(100) NOT NULL UNIQUE,
  account_password  VARCHAR(200) NOT NULL,
  account_type      public.account_type NOT NULL DEFAULT 'Client'
);

-- classification table
CREATE TABLE public.classification (
  classification_id   SERIAL PRIMARY KEY,
  classification_name VARCHAR(30) NOT NULL UNIQUE
);

-- inventory table
CREATE TABLE public.inventory (
  inv_id          SERIAL PRIMARY KEY,
  inv_make        VARCHAR(50)    NOT NULL,
  inv_model       VARCHAR(50)    NOT NULL,
  inv_year        NUMERIC(4, 0)  NOT NULL,
  inv_description TEXT           NOT NULL,
  inv_image       VARCHAR(200)   NOT NULL,
  inv_thumbnail   VARCHAR(200)   NOT NULL,
  inv_price       NUMERIC(9, 0)  NOT NULL,
  inv_miles       NUMERIC(10, 0) NOT NULL,
  inv_color       VARCHAR(30)    NOT NULL,
  classification_id INT          NOT NULL
    REFERENCES public.classification(classification_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- -------------------------------------------------------
-- STEP 3: Populate classification table
-- -------------------------------------------------------
INSERT INTO classification (classification_name)
VALUES
  ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');


-- -------------------------------------------------------
-- STEP 4: Populate inventory table
-- -------------------------------------------------------
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail,
  inv_price, inv_miles, inv_color, classification_id
)
VALUES
  -- Custom vehicles (classification_id = 1)
  ('Batmobile', 'Custom', 2021,
   'The iconic caped crusader''s ride. Armored, jet-powered, and street legal (barely).',
   '/images/batmobile.jpg', '/images/batmobile-tn.jpg',
   65000, 1200, 'Black', 1),

  ('DeLorean', 'DMC', 1981,
   'Back to the Future edition. Includes flux capacitor and gull-wing doors. Fuzzy dice and 3 cup holders included. This car has small interiors.',
   '/images/delorean.jpg', '/images/delorean-tn.jpg',
   45000, 88000, 'Silver', 1),

  ('Wrangler', 'Jeep', 2019,
   'Off-road beast with lifted suspension, custom paint, and a snorkel for water crossings.',
   '/images/wrangler.jpg', '/images/wrangler-tn.jpg',
   42000, 22000, 'Green', 1),

  -- Sport vehicles (classification_id = 2)
  ('Porsche', '911 Turbo', 2022,
   'Precision-engineered German sports car. 0 to 60 in 2.6 seconds. Twin-turbocharged flat-six.',
   '/images/porsche.jpg', '/images/porsche-tn.jpg',
   175000, 8000, 'Yellow', 2),

  ('Ferrari', 'F40', 1992,
   'The last Ferrari personally approved by Enzo Ferrari. A collector''s dream and track weapon.',
   '/images/ferrari.jpg', '/images/ferrari-tn.jpg',
   1400000, 4200, 'Red', 2),

  -- SUV vehicles (classification_id = 3)
  ('GM', 'Hummer', 2010,
   'Big and bold, the Hummer H2 defines the category. Unique styling with small interiors but massive road presence.',
   '/images/hummer.jpg', '/images/hummer-tn.jpg',
   58000, 75000, 'Yellow', 3),

  ('Ford', 'Explorer', 2021,
   'Family-ready three-row SUV with advanced safety features and plenty of cargo room.',
   '/images/explorer.jpg', '/images/explorer-tn.jpg',
   38000, 15000, 'White', 3),

  -- Truck vehicles (classification_id = 4)
  ('Ford', 'F-150', 2022,
   'America''s best-selling truck for over 40 years. Available in hybrid powertrain with Pro Power Onboard.',
   '/images/f150.jpg', '/images/f150-tn.jpg',
   52000, 9000, 'Blue', 4),

  ('Chevrolet', 'Silverado', 2021,
   'A workhorse with style. Multi-flex tailgate, available diesel engine, and best-in-class towing.',
   '/images/silverado.jpg', '/images/silverado-tn.jpg',
   48000, 12000, 'Black', 4),

  -- Sedan vehicles (classification_id = 5)
  ('Honda', 'Accord', 2023,
   'Refined and reliable mid-size sedan with turbocharged engine options and excellent fuel economy.',
   '/images/accord.jpg', '/images/accord-tn.jpg',
   29000, 5000, 'Gray', 5),

  ('Toyota', 'Camry', 2023,
   'The benchmark mid-size sedan. Smooth ride, spacious cabin, and top safety scores.',
   '/images/camry.jpg', '/images/camry-tn.jpg',
   27000, 3000, 'Silver', 5);


-- -------------------------------------------------------
-- STEP 5: Query 4 from assignment2.sql
-- Fix GM Hummer description: "small interiors" → "a huge interior"
-- -------------------------------------------------------
UPDATE inventory
SET inv_description = REPLACE(
  inv_description,
  'small interiors',
  'a huge interior'
)
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- -------------------------------------------------------
-- STEP 6: Query 6 from assignment2.sql
-- Update all image paths to include /vehicles/ subfolder
-- Before: /images/a-car-name.jpg
-- After:  /images/vehicles/a-car-name.jpg
-- -------------------------------------------------------
UPDATE inventory
SET
  inv_image     = REPLACE(inv_image,     '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


-- -------------------------------------------------------
-- WEEK 6: Wishlist table
-- Stores saved vehicles per account
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlist (
  wishlist_id  SERIAL PRIMARY KEY,
  account_id   INT NOT NULL
    REFERENCES public.account(account_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  inv_id       INT NOT NULL
    REFERENCES public.inventory(inv_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  added_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, inv_id)
);
