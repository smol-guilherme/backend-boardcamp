export default function validationHandler(query, body, params) {
  const dataArray = [query, body, params];
  const indexArray = [];
  for(const item of dataArray) {
    if(Object.keys(item).length!==0) {
      indexArray.push(dataArray.indexOf(item));
    }
  }
  if(indexArray.length > 0) {
    const flag = true;
    return {flag, indexArray};
  }
  return false;
}