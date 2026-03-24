-- *************************************
-- Assignment 2 - Task 1 SQL Statements
-- CSE 340 - CSE Motors
-- *************************************

-- Query 1: Insert Tony Stark into the account table
-- Note: account_id (serial) and account_type (default) handle their own values
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- Query 2: Update Tony Stark's account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


-- Query 3: Delete the Tony Stark record from the database
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


-- Query 4: Update "GM Hummer" description
-- Replace "small interiors" with "a huge interior" using PostgreSQL REPLACE()
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Query 5: Inner join - select make, model (inventory) and classification_name (classification)
-- for all inventory items in the "Sport" category
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM inventory inv
INNER JOIN classification cls
    ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';


-- Query 6: Update inv_image and inv_thumbnail paths to include "/vehicles" subfolder
-- Changes "/images/a-car.jpg" → "/images/vehicles/a-car.jpg"
UPDATE inventory
SET
    inv_image     = REPLACE(inv_image,     '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
