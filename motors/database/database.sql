-- *****************************************************
-- CSE Motors - Full Database Rebuild Script
-- Run this entire file at once to:
--   1. Create the account_type ENUM type
--   2. Create the classification table
--   3. Create the inventory table
--   4. Create the account table
--   5. Populate classification table
--   6. Populate inventory table
--   7. Apply Query 4 (GM Hummer description fix)
--   8. Apply Query 6 (image path update)
-- *****************************************************


-- =============================================
-- SECTION 1: CREATE CUSTOM TYPE
-- =============================================

CREATE TYPE public.account_type AS ENUM (
    'Client',
    'Employee',
    'Admin'
);


-- =============================================
-- SECTION 2: CREATE TABLES
-- =============================================

-- Classification table
CREATE TABLE IF NOT EXISTS public.classification (
    classification_id   SERIAL PRIMARY KEY,
    classification_name CHARACTER VARYING NOT NULL
);

-- Inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
    inv_id          SERIAL PRIMARY KEY,
    inv_make        CHARACTER VARYING(50)  NOT NULL,
    inv_model       CHARACTER VARYING(50)  NOT NULL,
    inv_year        CHARACTER(4)           NOT NULL,
    inv_description TEXT                   NOT NULL,
    inv_image       CHARACTER VARYING(200) NOT NULL,
    inv_thumbnail   CHARACTER VARYING(200) NOT NULL,
    inv_price       NUMERIC(9,0)           NOT NULL,
    inv_miles       INTEGER                NOT NULL,
    inv_color       CHARACTER VARYING(50)  NOT NULL,
    classification_id INTEGER NOT NULL
        REFERENCES public.classification(classification_id)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Account table
CREATE TABLE IF NOT EXISTS public.account (
    account_id        SERIAL PRIMARY KEY,
    account_firstname CHARACTER VARYING(50)  NOT NULL,
    account_lastname  CHARACTER VARYING(50)  NOT NULL,
    account_email     CHARACTER VARYING(100) NOT NULL,
    account_password  CHARACTER VARYING(200) NOT NULL,
    account_type      public.account_type    NOT NULL DEFAULT 'Client'
);


-- =============================================
-- SECTION 3: POPULATE CLASSIFICATION TABLE
-- =============================================

INSERT INTO public.classification (classification_name)
VALUES
    ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan');


-- =============================================
-- SECTION 4: POPULATE INVENTORY TABLE
-- =============================================

INSERT INTO public.inventory
    (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
     inv_price, inv_miles, inv_color, classification_id)
VALUES
    ('Chevrolet', 'Camaro', '2018',
     'If you want to look cool, buy a Camaro.',
     '/images/camaro.jpg', '/images/camaro-tn.jpg',
     25000, 101222, 'Gold', 2),

    ('Dodge', 'Challenger', '2016',
     'The Dodge Challenger is a great all-around car.',
     '/images/challenger.jpg', '/images/challenger-tn.jpg',
     23500, 80547, 'Black', 2),

    ('Ford', 'Mustang', '2019',
     'A great sporty car with all the features.',
     '/images/mustang.jpg', '/images/mustang-tn.jpg',
     31500, 21000, 'Yellow', 2),

    ('GM', 'Hummer', '2006',
     'The Hummer is a massive machine with small interiors, poor gas mileage and a horrible turning radius.',
     '/images/hummer.jpg', '/images/hummer-tn.jpg',
     58000, 56000, 'Black', 3),

    ('Jeep', 'Wrangler', '2017',
     'Go anywhere, do anything in the Wrangler.',
     '/images/wrangler.jpg', '/images/wrangler-tn.jpg',
     28000, 60271, 'Tan', 3),

    ('Jeep', 'Wrangler Unlimited', '2018',
     'More doors means more adventure.',
     '/images/wrangler-unlimited.jpg', '/images/wrangler-unlimited-tn.jpg',
     31500, 30000, 'Green', 3),

    ('Ford', 'F-150', '2022',
     'Best-selling truck in America for 45 years straight.',
     '/images/f150.jpg', '/images/f150-tn.jpg',
     55000, 500, 'Blue', 4),

    ('Chevrolet', 'Silverado 1500', '2020',
     'The dependable, long-lasting Silverado.',
     '/images/silverado.jpg', '/images/silverado-tn.jpg',
     42500, 18000, 'Silver', 4),

    ('Dodge', 'Ram 1500', '2019',
     'Ram trucks are built to handle the toughest jobs.',
     '/images/ram1500.jpg', '/images/ram1500-tn.jpg',
     38000, 27000, 'Red', 4),

    ('Batmobile', '', '2022',
     'When you absolutely must get somewhere before the Joker escapes.',
     '/images/batmobile.jpg', '/images/batmobile-tn.jpg',
     65000, 0, 'Black', 1),

    ('DeLorean', 'DMC', '1981',
     'Plutonium not included. Superman doors standard. 3 Cup holders. Fuzzy dice!',
     '/images/delorean.jpg', '/images/delorean-tn.jpg',
     45883, 88765, 'Silver', 1),

    ('Firefly', 'Serenity', '2517',
     'She may not look like much but she will get you there.',
     '/images/firefly.jpg', '/images/firefly-tn.jpg',
     57000, 1000000, 'Tan', 1),

    ('Ford', 'Crown Victoria', '2008',
     'The quintessential American sedan, reliable and roomy.',
     '/images/crownvic.jpg', '/images/crownvic-tn.jpg',
     6500, 190000, 'White', 5),

    ('Honda', 'Civic', '2020',
     'Practical, fuel-efficient, and fun to drive.',
     '/images/civic.jpg', '/images/civic-tn.jpg',
     22000, 12000, 'Blue', 5),

    ('Toyota', 'Camry', '2021',
     'One of the most reliable sedans money can buy.',
     '/images/camry.jpg', '/images/camry-tn.jpg',
     26000, 9000, 'White', 5);


-- =============================================
-- SECTION 5: QUERY 4 — Fix GM Hummer description
-- Replace "small interiors" with "a huge interior"
-- =============================================

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- =============================================
-- SECTION 6: QUERY 6 — Update image paths
-- Add "/vehicles" to inv_image and inv_thumbnail paths
-- =============================================

UPDATE inventory
SET
    inv_image     = REPLACE(inv_image,     '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
