-- QUERY 1: Insert the following new record
INSERT INTO public.account (
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

-- QUERY 2: Modify the Tony Stark record 
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';


-- QUERY 3: Delete the Tony Stark record 
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- QUERY 4: Modify the "GM Hummer" record 
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';

-- QUERY 5: Use an inner join to select the make and model fields and stuff
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory
    INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- QUERY 6: Update all records in the inventory table with image paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
