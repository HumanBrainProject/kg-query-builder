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
import { init as SentryInit, captureException as SentryCaptureException, showReportDialog as SentryShowReportDialog } from "@sentry/browser";
import ReactPiwik from "react-piwik";

const getSize = size => {
  if (size !== undefined && size !== null) {
    return `size=${size}&`;
  }
  return "";
};

const getFrom = from => {
  if (from !== undefined && from !== null) {
    return `from=${from}&`;
  }
  return "";
};

const getInstanceId = instanceId => {
  if (instanceId !== undefined && instanceId !== null) {
    return `instanceId=${instanceId}&`;
  }
  return "";
};

const getStage = stage => {
  if (stage) {
    return `stage=${stage}`;
  }
  return "";
};

const getSpace = space => {
  if(space) {
    return `?space=${space}`;
  }
  return "";
}

const endpoints = {
  settings: () => "/service/api/settings",
  user: () => "/service/api/user",
  spaces: () => "/service/api/spaces",
  types: () => "/service/api/types",
  structure: () => "/service/api/structure?withLinks=true",
  performQuery: (stage, from, size, instanceId, restrictToSpaces, params) => {
    const restrictToSpacesString =
      Array.isArray(restrictToSpaces) && restrictToSpaces.length
        ? "&restrictToSpaces=" +
          restrictToSpaces.map((space) => encodeURIComponent(space)).join(",")
        : "";
    const paramsString = Object.entries(params).reduce(
      (acc, [name, value]) => {
        acc += `&${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        return acc;
      },
      ""
    );
    return `/service/api/queries?${getSize(size)}${getFrom(
      from
    )}${getInstanceId(instanceId)}${getStage(
      stage
    )}${paramsString}${restrictToSpacesString}`;
  },
  getQuery: (queryId) => `/service/api/queries/${queryId}`,
  saveQuery: (queryId, space) =>
    `/service/api/queries/${queryId}/${getSpace(space)}`,
  deleteQuery: (queryId) => `/service/api/queries/${queryId}`,
  listQueries: (type) =>
    `/service/api/queries?type=${encodeURIComponent(type)}`
};
class API {

  constructor() {
    this._is_sentry_initilized = false;
    this._matomo = null;
  }

  setSentry(settings) {
    if (settings && !this._is_sentry_initilized) {
      this._is_sentry_initilized = true;
      SentryInit({
        ...settings,
        autoSessionTracking: false
      });
    }
  }

  captureException(e) {
    if (this._is_sentry_initilized) {
      SentryCaptureException(e);
    }
  }

  showReportDialog(customSettings) {
    if (this._is_sentry_initilized) {
      const defaultSettings = {
        title: "An unexpected error has occured.",
        subtitle2: "We recommend you to save all your changes and reload the application in your browser. The KG team has been notified. If you'd like to help, tell us what happened below.",
        labelEmail: "Email",
        labelName: "Name",
        labelComments: "Please fill in a description of your error use case"
      };
      const settings = {
        ...defaultSettings,
        ...customSettings
      };
      SentryCaptureException(new Error(settings.title)); //We generate a custom error as report dialog is only linked to an error.
      SentryShowReportDialog(settings);
    }
  }

  setMatomo(settings) {
    if (settings?.url && settings?.siteId) {
      this._matomo = new ReactPiwik({
        url: settings.url,
        siteId:settings.siteId,
        trackErrors: true
      });
    }
  }

  trackCustomUrl(url) {
    if (this._matomo && url) {
      ReactPiwik.push(["setCustomUrl", url]);
    }
  }

  trackPageView() {
    if (this._matomo) {
      ReactPiwik.push(["trackPageView"]);
    }
  }

  trackEvent(category, name, value) {
    if (this._matomo) {
      ReactPiwik.push(["trackEvent", category, name, value]);
    }
  }

  trackLink(category, name) {
    if (this._matomo) {
      ReactPiwik.push(["trackLink", category, name]);
    }
  }

  get endpoints() {
    return endpoints;
  }
}

export default new API();