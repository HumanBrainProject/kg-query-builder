/*
 * Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This open source software code was developed in part or in whole in the
 * Human Brain Project, funded from the European Union's Horizon 2020
 * Framework Programme for Research and Innovation under
 * Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 * (Human Brain Project SGA1, SGA2 and SGA3).
 *
 */

import React from "react";
import { render } from "react-dom";
import ReactPiwik from "react-piwik";
import {JssProvider} from "react-jss";
// import { configure } from "mobx";
//import reportWebVitals from './reportWebVitals';

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./Views/App";

// configure({
//   enforceActions: "always",
//   computedRequiresReaction: true,
//   reactionRequiresObservable: true,
//   observableRequiresReaction: true,
//   disableErrorBoundaries: false // help to debug only
// });

//reportWebVitals();

new ReactPiwik({ //NOSONAR
  url: process.env.REACT_APP_MATOMO_URL,
  siteId: process.env.REACT_APP_MATOMO_SITE_ID,
  trackErrors: true
});

render(
  <React.StrictMode>
    <JssProvider id={{minify: process.env.NODE_ENV === 'production'}}>
      <App />
    </JssProvider>
  </React.StrictMode>, document.getElementById("root"));
