export default function validationHandler(query, body) {
  console.log(Object.keys(query), Object.keys(body));
  if(Object.keys(query).length===0 && Object.keys(body).length===0)
    return false;
  return true;
}