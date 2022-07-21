export default function validationHandler(params, body) {
  if(Object.keys(params).length===0&&Object.keys(body).length===0)
    return false;
  return true;
}