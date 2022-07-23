import validationHandler from "./validationHandler.js";

export default function handleRentalData(query, body, params) {
  let queryString = "";
  const response = validationHandler(query, body, params);
  const opIndex = response.indexArray;
  const flag = response.flag;
  if (opIndex.length > 0) {
    for (const index of opIndex) {
      queryString += populateQuery(index);
    }
  } else {
    flag = opIndex;
    // queryString=`
    //   SELECT
    //     r.*,
    //     (
    //       SELECT (id, name)
    //       FROM customers
    //     ) AS customer,
    //     (
    //       SELECT
    //         (g.id, g.name, g."categoryId"),
    //         (
    //           SELECT name AS "categoryName"
    //           FROM categories
    //         )
    //       FROM games AS g
    //     )
    //     FROM rentals AS r;
    // `;
    queryString = `
      SELECT
        r.*,
        (
          SELECT name
          FROM customers 
        )
      FROM rentals
      AS r;
    `;
  }
  return { queryString, flag };
}

function populateQuery(operator) {
  let queryData;
  switch (operator) {
    case 0:
      queryData = `
        SELECT 
          r.*,
          (
            SELECT (id, name) 
            FROM customers 
            WHERE id=$1
          ) AS customer,
          (
            SELECT 
              (g.id, g.name, g."categoryId"),
              (
                SELECT name AS "categoryName"
                FROM categories 
                WHERE id=g."categoryId"
              )
            FROM games AS g
          )
          FROM rentals AS r;
      `;
      break;
    case 1:
      queryData = `
        INSERT INTO 
          rentals 
          (
            "customerId",
            "gameId",
            "daysRented",
            "rentDate",
            "returnDate",
            "originalPrice",
            "delayFee"
          )
          VALUES 
          (
            $1, 
            $2, 
            $3, 
            $4, 
            $5,
            $6 * (SELECT "pricePerDay" FROM games WHERE id=$2),
            $7
          )
      `;
      //   WHERE
      //   NOT EXISTS (SELECT name FROM games WHERE name ILIKE $1)
      // AND
      //   EXISTS (SELECT id FROM categories WHERE id=$4);
      break;
    case 2:
      break;
  }
  return queryData;
}
