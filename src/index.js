import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import Raven from "raven-js";
// import * as Sentry from "@sentry/react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

Raven.config("https://a309791045d158d2101fe3161337da9b@o4508569202393088.ingest.de.sentry.io/4508569212551248",{
  release: "0-0-0",
  environment: "development-test",
});

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
