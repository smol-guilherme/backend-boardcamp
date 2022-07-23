export default function rentDate(req, res, next) {
  // console.log(res.locals.validationData);
  // console.log(req.method);
  const data = res.locals.validationData;
  switch(req.method) {
    case "POST":
      data.rentDate = new Date().toISOString();
      data.returnDate = null;
      data.originalPrice = parseInt(data.daysRented);
      data.delayFee = null;
      break;
    case "PUT":
      break;
  }
  console.log(data);
  res.locals.validationData = {...data};
  res.locals.queryData = Object.values(data)
  next();
}