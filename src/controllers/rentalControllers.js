import connection from "../database/postgresdb.js";

export async function getRentals(req, res) {
  const { rows: response } = await connection.query(res.locals.queryParams, res.locals.queryData);
  res.status(200).send(response);
  return;
}

export async function createRentals(req, res) {
  const { rowCount } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (rowCount===0) {
    res.status(400).send();
    return;
  }
  res.status(201).send();
  return;
}

export async function updateRentals(req, res) {
  const { rows: response } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (response.length===0) {
    res.status(404).send();
    return;
  }
  if(response[0].returnDate===response[0].last_value) {
    res.status(400).send();
    return;
  }
  res.status(200).send();
  return;
}

export async function deleteRentals(req, res) {
  const { rowCount } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (rowCount===0) {
    res.status(400).send();
    return;
  }
  res.status(200).send();
  return;
}