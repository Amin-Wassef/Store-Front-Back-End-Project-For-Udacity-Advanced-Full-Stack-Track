CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    order_id bigint REFERENCES orders(id) NOT NULL,
    pdt_id bigint REFERENCES products(id) NOT NULL,
    quantity integer NOT NULL
);