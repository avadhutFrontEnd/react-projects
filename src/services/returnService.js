import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/returns";

export function returnRental(customerId, movieId) {
  return http.post(apiEndpoint, {
    customerId,
    movieId,
  });
}

