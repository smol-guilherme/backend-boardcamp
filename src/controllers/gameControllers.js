import connection from "../database/postgresdb.js";

export async function getGames(req, res) {
  const { rows: response } = await connection.query(res.locals.queryParams);
  res.status(200).send(response);
  return;
}

export async function createGames(req, res) {
  console.log(res.locals.queryData);
  const { rowCount } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (rowCount===0) {
    res.status(409).send();
    return;
  }
  res.status(201).send();
  return;
}