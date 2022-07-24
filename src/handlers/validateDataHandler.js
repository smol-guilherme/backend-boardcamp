export default function validationDataHandler(indexArray, dataArray, method) {
  let queryString = "";
  let data;
  switch (indexArray[0]) {
    case 0:
      break;
    case 1:
      if (method === "POST") {
        queryString = `
        INSERT INTO 
          customers 
          (
            name, 
            phone, 
            cpf, 
            birthday
          ) 
          SELECT $1, $2, $3, $4 
          WHERE 
            NOT EXISTS 
            (
              SELECT cpf 
              FROM customers 
              WHERE cpf=$3::VARCHAR
            )`;
        data = dataArray[1];
      } else {
        queryString = `
          UPDATE
            customers 
          SET
            name=$1,
            phone=$2,
            cpf=$3,
            birthday=$4
          WHERE
            id=$5
          AND
            NOT EXISTS 
              (
                SELECT
                  cpf
                FROM
                  customers
                WHERE
                  cpf=$3
                AND
                  id!=$5
              )
        `;
        data = [dataArray[1], dataArray[2]];
      }
      break;
    case 2:
      queryString = `
      SELECT
        *
      FROM
        customers
      WHERE
        id=$1;
      `;
      data = dataArray[2];
      break;
  }
  return { queryString, data };
}
