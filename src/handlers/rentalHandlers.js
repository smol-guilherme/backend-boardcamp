import validationHandler from "./validationHandler.js";

export default function handleRentalData(dataArray) {
  let queryString = "";
  const response = validationHandler(dataArray);
  const flag = response.flag;
  const opIndex = response.indexArray;
  if (opIndex.length > 0) {
    for (const index of opIndex) {
      queryString += populateQuery(index);
    }
  } else {
    queryString = `
      SELECT 
        r.*,
        (
          SELECT
            json_build_object
              (
                'id', id, 
                'name', name
              ) as customer
          FROM 
            ( 
              SELECT 
                c.id, c.name 
              FROM 
                customers AS c 
              WHERE c.id=r."customerId" 
            ) d
        ),
        (
          SELECT
            json_build_object
              (
                'id', id, 
                'name', name,
                'categoryId', "categoryId", 
                'categoryName', 
                (
                  SELECT
                    name
                  FROM
                    categories
                  WHERE
                    id="categoryId"
                )
              ) AS game
          FROM 
            ( 
              SELECT 
                v.id, v.name, v."categoryId"
              FROM 
                games AS v 
              WHERE v.id=r."gameId" 
            ) g
        )
      FROM 
        rentals AS r;
    `;
  }
  return { queryString, flag, opIndex };
}

function populateQuery(operator) {
  let queryData;
  switch (operator) {
    case 0:
      queryData = `
      SELECT 
        r.*,
        (
          SELECT
            json_build_object
              (
                'id', id, 
                'name', name
              ) as customer
          FROM 
            ( 
              SELECT 
                c.id, c.name 
              FROM 
                customers AS c 
              WHERE c.id=r."customerId" 
            ) d
        ),
        (
          SELECT
            json_build_object
              (
                'id', id, 
                'name', name,
                'categoryId', "categoryId", 
                'categoryName', 
                (
                  SELECT
                    name
                  FROM
                    categories
                  WHERE
                    id="categoryId"
                )
              ) AS game
          FROM 
            ( 
              SELECT 
                v.id, v.name, v."categoryId"
              FROM 
                games AS v 
              WHERE v.id=r."gameId" 
            ) g
        )
      FROM 
        rentals AS r
      WHERE
        "customerId"=$1;
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
        SELECT 
          $1, 
          $2, 
          $3, 
          $4, 
          $5::DATE,
          $6 * (SELECT "pricePerDay" FROM games WHERE id=$2),
          $7::INTEGER
        WHERE
          EXISTS (SELECT id FROM games WHERE id=$2)
        AND
          EXISTS (SELECT id FROM customers WHERE id=$1)
        AND
          (SELECT
            (
              SELECT 
                COUNT(*) 
              FROM 
                rentals 
              WHERE 
                "returnDate" 
                IS NULL
              AND
                "gameId"=$2 
            ) < (
              SELECT 
                "stockTotal"
              FROM
                games
              WHERE
                id=$2
            )
          );`;
      break;
    case 2:
      break;
  }
  return queryData;
}
