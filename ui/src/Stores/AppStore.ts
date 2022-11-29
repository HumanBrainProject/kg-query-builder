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

import { observable, action, computed, makeObservable } from "mobx";

import { RootStore } from "./RootStore";

import { Theme } from "../Themes/Theme";
import DefaultTheme from "../Themes/Default";
import BrightTheme from "../Themes/Bright";
import { ErrorInfo } from "react";

interface GlobalError {
  error: Error, 
  info: ErrorInfo
}

interface Themes {
  [index:string]: Theme
}

const themes: Themes = {};
themes[DefaultTheme.name] = DefaultTheme;
themes[BrightTheme.name] = BrightTheme;

export class AppStore{
  globalError?: GlobalError;
  _currentThemeName: string = DefaultTheme.name;

  rootStore:RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      globalError: observable,
      _currentThemeName: observable,
      currentTheme: computed,
      setGlobalError: action,
      dismissGlobalError: action,
      setTheme: action,
      toggleTheme: action
    });

    this.rootStore = rootStore;
    this.setTheme(localStorage.getItem("theme") ?? DefaultTheme.name);
  }

  setGlobalError(error: Error, info: ErrorInfo) {
    this.globalError = {
      error:error, 
      info:info
    };
  }

  dismissGlobalError() {
    this.globalError = undefined;
  }

  get currentTheme() {
    return themes[this._currentThemeName];
  }

  setTheme(name: string){
    this._currentThemeName = themes[name]? name: DefaultTheme.name;
    localStorage.setItem("theme", this._currentThemeName);
  }

  toggleTheme(){
    if(this._currentThemeName === BrightTheme.name){
      this.setTheme(DefaultTheme.name);
    } else {
      this.setTheme(BrightTheme.name);
    }
  }
}

export default AppStore;