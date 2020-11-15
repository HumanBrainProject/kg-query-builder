/*
*   Copyright (c) 2020, EPFL/Human Brain Project PCO
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "react-jss";

import { useStores } from "../Hooks/UseStores";

import ErrorBoundary from "./ErrorBoundary";
import Layout from "./Layout";

const App = observer(() => {

  const { appStore } = useStores();

  const theme = appStore.currentTheme;

  useEffect(() => {
    appStore.initialize();
    document.addEventListener("keydown", appStore.handleGlobalShortcuts);
    return () => {
      document.removeEventListener("keydown", appStore.handleGlobalShortcuts);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Layout />
      </ThemeProvider>
    </ErrorBoundary>
  );
});

export default App;
