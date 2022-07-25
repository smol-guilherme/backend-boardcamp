import validationHandler from "./validationHandler.js";

export default function handleRentalData(dataArray, method) {
  let queryString = "";
  const response = validationHandler(dataArray);
  const flag = response.flag;
  const opIndex = response.indexArray;
  if (opIndex.length > 0) {
    for (const index of opIndex) {
      queryString += populateQuery(index, method);
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
        rentals AS r
      ORDER BY id DESC;
    `;
  }
  return { queryString, flag, opIndex };
}

function populateQuery(operator, method) {
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
        "customerId"=$1
      ;`;
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
      if (method === "POST") {
        queryData = `
        WITH entry_found AS 
        (
          SELECT 
            LAST_VALUE("returnDate") 
              OVER (ORDER BY "returnDate") last_value
          FROM rentals 
          WHERE id=$1
        )
        UPDATE 
          rentals
        SET
          "returnDate"=
            CASE
              WHEN "returnDate" IS NULL
                THEN $2::date
                ELSE "returnDate"
            END,
          "delayFee"=
            CASE
              WHEN ("returnDate">"rentDate"+"daysRented")
              THEN
                (
                  SELECT "pricePerDay"
                  FROM games 
                  WHERE id="gameId"
                ) * ("returnDate"-"rentDate"-"daysRented")
              ELSE
                NULL
            END
        FROM entry_found
        WHERE id=$1
        RETURNING "returnDate", last_value;
        `
      } else {
        queryData = `
        DELETE 
          FROM rentals 
        USING entry_found
        WHERE id=$1 
        AND "returnDate" IS NULL
        ;`;
      }
      break;
  }
  return queryData;
}
