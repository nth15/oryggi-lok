const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/**
 * Framkvæmir SQL fyrirspurn á gagnagrunn sem keyrir á `DATABASE_URL`,
 * skilgreint í `.env`
 *
 * @param {string} q Query til að keyra
 * @param {array} values Fylki af gildum fyrir query
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q, values);

    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Bætir við umsókn.
 *
 * @param {array} data Fylki af gögnum fyrir umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function insert(data) {
  const q = `
INSERT INTO users
(name, email, phone, text)
VALUES
($1, $2, $3, $4)`;
  const values = [data.name, data.email, data.phone, data.text];

  return query(q, values);
}

/**
 * Sækir allar umsóknir
 *
 * @returns {array} Fylki af öllum umsóknum
 */
async function select() {
  const result = await query('SELECT * FROM users ORDER BY id');

  return result.rows;
}


async function search(username) {
  const client = new Client({ connectionString });

  const result = await client.query(`SELECT * FROM users WHERE name = ${username}`);

  return result.rows;
}

/**
 * Deletes user.
 *
 * @param {string} id Id á umsókn
 */
async function deleteRow(id) {
  const q = 'DELETE FROM users WHERE id = $1';

  return query(q, [id]);
}

module.exports = {
  insert,
  select,
  search,
  deleteRow,
};
