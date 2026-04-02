-- Query 1: Insert Tony Stark into the account table

INSERT INTO account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);


-- Query 2: Update Tony Stark's account_type to "Admin"

UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


-- Query 3: Delete the Tony Stark record

DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Query 4: Update GM Hummer description

UPDATE inventory
SET inv_description = REPLACE(
  inv_description,
  'small interiors',
  'a huge interior'
)
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: Inner Join – Sport category inventory

SELECT
  inv.inv_make,
  inv.inv_model,
  cls.classification_name
FROM inventory inv
INNER JOIN classification cls
  ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- Query 6: Update inv_image and inv_thumbnail paths
UPDATE inventory
SET
  inv_image     = REPLACE(inv_image,     '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
