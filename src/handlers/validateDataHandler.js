export default function validationDataHandler(indexArray, dataArray) {
  let queryString = "";
  let data;
  switch (indexArray[0]) {
    case 0:
      break;
    case 1:
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
      break;
    case 2:
      queryString = `
      SELECT
        *
      FROM
        customers
      WHERE
        id=$1;
      `
      data = dataArray[2];
      break;
  }
  return { queryString, data };
}
