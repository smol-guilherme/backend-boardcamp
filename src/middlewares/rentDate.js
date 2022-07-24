export default function rentDate(req, res, next) {
  const data = res.locals.validationData;
  switch(res.locals.reqPath) {
    case "rentals":
      data.rentDate = new Date().toISOString();
      data.returnDate = null;
      data.originalPrice = parseInt(data.daysRented);
      data.delayFee = null;
      break;
    case "rentals return":
      data.returnDate = new Date().toISOString();
      break;
  }
  res.locals.validationData = {...data};
  res.locals.queryData = Object.values(data)
  next();
}