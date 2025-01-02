import Raven from "raven-js";

function init() {
  Raven.config(
    "https://a309791045d158d2101fe3161337da9b@o4508569202393088.ingest.de.sentry.io/4508569212551248",
    {
      release: "0-0-0",
      environment: "development-test",
    }
  ).install();
}

function log(error) {
  Raven.captureException("Logging the Error", error);
}

export default {
  init,
  log,
};
