import connection from "../database/postgresdb.js";

export async function getRentals(req, res) {
  const { rows: response } = await connection.query(res.locals.queryParams, res.locals.queryData);
  // console.log(response);
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

export async function editRentals(req, res) {
  const { rowCount } = await connection.query(res.locals.queryParams, res.locals.queryData);
  if (rowCount===0) {
    res.status(409).send();
    return;
  }
  res.status(201).send();
  return;
}


// `SELECT r.*,(SELECT json_build_object('id', id, 'name', name) as customer FROM (SELECT c.id, c.name FROM customers AS c WHERE c.id=r."customerId" ) d),(SELECT json_build_object( 'id', id, 'name', name, 'categoryId', "categoryId", 'categoryName', ( SELECT name FROM categories WHERE id="categoryId" ) ) AS game FROM (SELECT v.id, v.nSELECT r.*,(SELECT json_build_object('id', id, 'name', name) as customer FROM (SELECT c.id, c.name FROM customers AS c WHERE c.id=r."customerId" ) d),(SELECT json_build_object( 'id', id, 'name', name, 'categoryId', "categoryId", 'categoryName', ( SELECT name FROM categories WHERE id="categoryId" ) ) AS game FROM (SELECT v.id, v.name, v."categoryId" FROM games AS v WHERE v.id=r."gameId" ) g ) FROM rentals AS r WHERE id=1;