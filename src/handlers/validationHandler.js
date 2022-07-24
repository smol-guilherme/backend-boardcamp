export default function validationHandler(dataArray) {
  const indexArray = [];
  let flag = false;
  for(const item of dataArray) {
    if(Object.keys(item).length!==0) {
      indexArray.push(dataArray.indexOf(item));
    }
  }
  if(indexArray.length > 0) {
    flag = true;
  }
  return {flag, indexArray};
}