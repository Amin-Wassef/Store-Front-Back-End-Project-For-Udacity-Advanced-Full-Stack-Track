import { Pool } from 'pg';

/*
      const client = new Pool({
      host: 'hard code',
      user: 'hard code',
      password: 'hard code',
      database: 'hard code',
      });
    */

// OR using enviroment variables to hide data (especially 'password')

import dotenve from 'dotenv';

dotenve.config();

const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATA_BASE, PG_DATA_BASE_TEST, ENV } =
  process.env;

let client = new Pool({}); // OR let client = new Pool

if (ENV === 'dev') {
  client = new Pool({
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATA_BASE,
  });
}

if (ENV === 'test') {
  client = new Pool({
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATA_BASE_TEST,
  });
}

export default client;
