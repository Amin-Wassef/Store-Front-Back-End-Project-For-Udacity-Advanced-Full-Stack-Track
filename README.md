Building A StoreFront Backend App [Uadcity advanced track second project]


Step One (project structuring):

As the project is build using typescript and server side node js then compiled to a dist folder, and needs using of prettier, eslint and testing using Jasmine, :

- Creating src folder containing index.ts file for building localseerver and for the main directory.

- Inside the src folder also:
    - Creating models folder containing:
        - users_m.ts file for "users" table models.
        - products_m.ts file for "products" table models.
        - orders_m.ts file for "orders" & "orders_products" tables models.

    - Creating routes_handlers folder containing:
        - users_r_h.ts file for "users" table handlers and routes.
        - products_r_h.ts file for "products" table handlers and routes.
        - orders_r_h.ts file for "orders" & "orders_products" tables handlers and routes.

    - Creating middleware folder containing:
        - authiorizations folder for handeling:
            - super admin authorizations.
            - admin authorizations.
            - users authorizations.
        - checking folder for:
            - checking orders presence & activity.
            - checking { user - order } matching.

    - Creating tests folder conatining:
        - indexSpec.ts file for testing index.ts codes.
        - models folder containing:
            - users_mSpec.ts file for testing users table models.
            - products_mSpec.ts file for testing products table models.
            - orders_products_mSpec.ts file for testing orders_products table models.
        - routes_handlers folder containing:
            - users_r_hSpec.ts file for testing users table end points.
            - products_r_hSpec.ts file for testing products table end points.
            - orders_products_r_hSpec.ts file for testing orders_products table end points.
        - helpers folder containing reportes.ts file with its congigurations.

- Creating spec folder containing support folder containing jasmine.jason file for directin jasmine to folders and files for testing.

- Creating .env file containing database secret data in the .gitignore file so you will find .env.example file to file in it to be able to run the app with an empty data base on your local copmuter.


Step Two:

- Running node to my app throught npm init and making config. also package.json file apeared.
- Creating proper scripts needed in the package.json file:
    - "dev": "nodemon src/index.ts",
    - "build": "tsc",
    - "js": "node dist/index.js",
    - "jasmine": "jasmine",
    - "start": "npm run build && npm run js",
    - "test": "npx db-migrate reset --env test && set ENV=test&& npx db-migrate up --env test && npm run build && jasmine && npx db-migrate reset --env test",
    - "prettier": "prettier --write src/**/*.ts",
    - "lint": "eslint . --ext. ts"
- Creating tsconfig.json file for typescript config. using npx tsc --init 
- Installing needed dependencies and dev_dependencies and type definitions (as indicated in package.json file) from:
    - npm i dependancy name (in dependencies)
    - npm i --save-dev dependancy name (in dev_dependencies)
    - npm i --save-dev type definition name (in dev_dependencies)
- Creating .prettierrc, .eslintrc, .prettierignore, .eslintignore and .gitignore files for ignoring node_modules dist folders using echo {}> file name.


Step Three:

 - Building the server (as shown in index.ts file):
    - importing express
    - const app = express();
    - Creating a port and listening on it on a local host.
 - Creating the main api end point using get request. 


Step Four:

- Use => 'npm install' cmd to install all dependencies included in the app.

- To connect to database:

    - Create 2 empty databases on your computer using 'Postgres':
        - pharmacy => to implement tables and data in it.
        - pharmacy_test => to use it in testing purposes without affecting tables and data in 'pharmacy' database.

    - Use => 'npx migrate-up' cmd to run schema migration so that 4 tables will be build in your database:
        - users
        - products
        - orders
        - orders_products

            - NOTE: Relationships between tables and each table constraints you can find them in migration file in the migration folder.

    - Use => 'npm run dev' cmd to run the server on your local host to be able to use the app.

            - NOTE: Port used for this app => 5000.
