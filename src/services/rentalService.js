import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/rentals";

function rentalUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRentals() {
  return http.get(apiEndpoint);
}

export function getRental(rentalId) {
  return http.get(rentalUrl(rentalId));
}

export function createRental(rental) {
  return http.post(apiEndpoint, {
    customerId: rental.customerId,
    movieId: rental.movieId,
  });
}

