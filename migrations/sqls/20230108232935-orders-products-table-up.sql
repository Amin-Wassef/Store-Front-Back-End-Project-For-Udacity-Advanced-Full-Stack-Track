CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    order_id bigint REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    pdt_id bigint REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL
);