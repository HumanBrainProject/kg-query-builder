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

import React, { useEffect, Suspense } from "react";
import { observer } from "mobx-react-lite";
import { JssProvider, ThemeProvider } from "react-jss";//NOSONAR
import { BrowserRouter, Navigate, Routes, Route, useLocation, matchPath } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Styles from "./Views/Styles";
import API from "./Services/API";
import RootStore from "./Stores/RootStore";
import APIProvider from "./Views/APIProvider";
import AuthProvider from "./Views/AuthProvider";
import StoresProvider from "./Views/StoresProvider";
import AuthAdapter from "./Services/AuthAdapter";
import ErrorBoundary from "./Views/ErrorBoundary";
import Layout from "./Views/Layout";
import Settings from "./Views/Settings";
import SpinnerPanel from "./Components/SpinnerPanel";
import GlobalError from "./Views/GlobalError";
import Shortcuts from "./Views/Shortcuts";

const Authenticate = React.lazy(() => import("./Views/Authenticate"));
const UserProfile = React.lazy(() => import("./Views/UserProfile"));
const Spaces = React.lazy(() => import("./Views/Spaces"));
const Types = React.lazy(() => import("./Views/Types"));
const Logout = React.lazy(() => import("./Views/Logout"));
const Home = React.lazy(() => import("./Views/Home"));
const Query = React.lazy(() => import("./Views/Query"));

interface AppProps {
  stores: RootStore;
  api: API;
  authAdapter?: AuthAdapter;
}

const App = observer(({ stores, api, authAdapter } : AppProps) => {

  const { appStore, queryBuilderStore } = stores;

  const theme = appStore.currentTheme;

  const location = useLocation();
  const matchQueryId = matchPath({path:"queries/:id/*"}, location.pathname);

  useEffect(() => { 

    const onUnload = (e: Event) => {
      if (queryBuilderStore?.hasChanged) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Styles />
      <APIProvider api={api}>
        <AuthProvider adapter={authAdapter} >
          <StoresProvider stores={stores}>
            <Layout>
              {appStore.globalError?
                <GlobalError />
                :
                <Settings authAdapter={authAdapter}>
                  <Suspense fallback={<SpinnerPanel text="Loading resource..." />} >
                    <Routes>
                      <Route path={"/logout"} element={<Logout />}/>
                      <Route path={"*"} element={
                        <Authenticate >
                          <UserProfile>
                            <Spaces>
                              <Types>
                                <Shortcuts />
                                <Suspense fallback={<SpinnerPanel text="Loading resource..." />} >
                                  <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="queries/:id" element={<Query mode="build" />} />
                                    <Route path="queries/:id/edit" element={<Query mode="edit" />} />
                                    <Route path="queries/:id/execute" element={<Query mode="execute" />} />
                                    <Route path="queries/:id/*" element={<Navigate to={`/queries/${matchQueryId?.params.id}`} replace={true} />} />
                                    <Route path="*" element={<Navigate to="/" replace={true} />} />  
                                  </Routes>
                                </Suspense>
                              </Types>
                            </Spaces>
                          </UserProfile>
                        </Authenticate>
                      }/>
                    </Routes>
                  </Suspense>
                </Settings>
              }
            </Layout>
          </StoresProvider>
        </AuthProvider>
      </APIProvider>
    </ThemeProvider>
  );
});
App.displayName = "App";

const Component = ({ stores, api, authAdapter }: AppProps) => (
  <JssProvider id={{minify: process.env.NODE_ENV === 'production'}}>
    <ErrorBoundary stores={stores} >
      <BrowserRouter>
        <App stores={stores} api={api} authAdapter={authAdapter}/>
      </BrowserRouter>
    </ErrorBoundary>
  </JssProvider>
);

export default Component;