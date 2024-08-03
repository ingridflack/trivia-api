import NotFound from "../errors/NotFound.js";

function handleRouteNotFound(req, res, next) {
  next(new NotFound());
}

export default handleRouteNotFound;
