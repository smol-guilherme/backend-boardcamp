import connection from "../database/postgresdb.js";

export async function getCustomers(req, res) {
  console.log('im getcustomers');
  console.log(res.locals.queryParams);
  console.log(res.locals.queryData);
  const { rows: response } = await connection.query(res.locals.queryParams, res.locals.queryData);
  console.log(response);
  if(res.locals.queryData !== undefined) {
    res.status(200).send(response[0]);
  } else {
    res.status(200).send(response);
  }
  return;
}

export async function createCustomers(req, res) {
  const { rowCount } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (rowCount===0) {
    res.status(409).send();
    return;
  }
  res.status(201).send();
  return;
}

export async function editCustomers(req, res) {
  const { rowCount } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (rowCount===0) {
    res.status(409).send();
    return;
  }
  res.status(201).send();
  return;
}