- API Requirements:
    - The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

    - The following are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.



- API End points Needed:
    - Products:
        - Create new product => app.post('/products')
        - Show all products' data => app.get('/products')
        - Show specific product's data => app.get('/products/:id')
        - Update product's data => app.patch('/products/:id')
        - Delete product => app.delete('/products/:id')

    - Users:
        - Create new user => app.post('/users')
        - Show all users' data => app.get('/users')
        - Show specific user's data => app.get('/users/:id')
        - Update user's data => app.patch('/users/:id')
        - Delete user => app.delete('/users/:id')
        - Password authentication => app.post('/users/authenticate')

    - Orders:
        - Create new order => app.post('/orders')
        - Show all orders' data => app.get('/orders')
        - Show specific order's data => app.get('/orders/:order_id')
        - Update order's status => app.patch('/orders/:order_id)
        - Delete order => app.delete('/orders/:order_id')

            - Inside the orders it is needed to:
                - Add product => app.post('/orders/:order_id/orders_products')
                - Show all orders' products and quantities => app.get('/orders/orders_products/:all')
                - Show specific order's products and quantities => app.get('/orders/:order_id/orders_products/:op_id')
                - Update product's quantities => app.patch('/orders/:order_id/orders_products/:op_id')
                - Delete product => app.delete('/orders/:order_id/orders_products/:op_id')

    - NOTE: each end point is organized using some middlewares for checking and authorization depending on the need they will be shown in each end point inside the app.



- Data Shape Needed:
    - Products table with 3 columns:
        - id SERIAL PRIMARY KEY,
        - pdt_name VARCHAR(100) NOT NULL,
        - pdt_price DECIMAL(4,2) NOT NULL

    - Users table with 4 columns:
        - id SERIAL PRIMARY KEY,
        - first_name VARCHAR(50) NOT NULL,
        - last_name VARCHAR(50) NOT NULL,
        - password VARCHAR(200) NOT NULL

    - Orders table with 3 columns:
        - id SERIAL PRIMARY KEY,
        - user_id bigint REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        - status VARCHAR(15) NOT NULL

            - NOTES:
                1) The relationship between 'users' & 'orders' tables is {one to many} => That's why we need 'user_id' column in the 'orders' table as foriegn key of the 'users' table to realise this relationship.
                2) The relationship between 'products' & 'orders' tables is {many to many} => That's why we need a new table to contain 'pdt_id' column & 'order_id' column as foriegn keyes of the 'products' table and 'orders' table to realise this relationship, to be able to act on products using CRUD operations in the orders.

                - Orders_Products table with 4 columns:
                    - id SERIAL PRIMARY KEY,
                    - order_id bigint REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
                    - pdt_id bigint REFERENCES products(id) ON DELETE CASCADE NOT NULL,
                    - quantity integer NOT NULL