export default function pathHandlerMiddleware(req, res, next) {
  console.log(req.method);
  const path = req.path.replace(/^\//, "");
  console.log(path);
  let queryParams;
  let queryData;
  switch (path) {
    case "health":
      res.status(200).send("OK");
      return;
    case "categories":
      break;
    case "games":
      break;
    case "customers":
      break;
    case "rentals/metrics":
    case "rentals":
      break;
    default:
      res.status(404).send("PAGE NOT FOUND");
      return;
  }

  next();
}
