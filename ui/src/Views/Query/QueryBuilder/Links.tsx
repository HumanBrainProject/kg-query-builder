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
const Links = () => null; //NOSONAR
//TODO: update links
// import React from 'react';
// import { createUseStyles } from 'react-jss';
// import { observer } from 'mobx-react-lite';

// import useStores from '../../../Hooks/useStores';

// const useStyles = createUseStyles({
//   container: {
//     marginTop: "10px",
//     color: "var(--ft-color-normal)",
//     "& a, & a:visited, &a:active": {
//       color: "var(--ft-color-loud)",
//       "&:hover": {
//         color: "var(--ft-color-louder)",
//       }
//     }
//   }
// });

// const Links = observer(() => {

//   const classes = useStyles();

//   const { queryBuilderStore } = useStores();
//   if (queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode && !queryBuilderStore.hasQueryChanged) {
//     return (
//       <div className={classes.container}>
//         <h6>To go further: </h6>
//         <ul>
//           <li>
//             <a href="/apidoc/index.html?url=/apispec/spring%3Fgroup%3D0_public%0A#/query-api/executeStoredQueryUsingGET_2" rel="noopener noreferrer" target="_blank">Service API documentation</a> to query {queryBuilderStore.sourceQuery.id}
//           </li>
//           <li>
//         Get <a href={`/query/${queryBuilderStore.sourceQuery.id}/python`} rel="noopener noreferrer" target="_blank">python code</a> for this stored query
//           </li>
//           <li>
//         Get <a href={`/query/${queryBuilderStore.sourceQuery.id}/python/pip`}rel="noopener noreferrer" target="_blank">PyPi compatible python code</a> for this stored query
//           </li>
//         </ul>
//       </div>
//     );
//   }
//   return null;
// });
// Links.displayName = 'Links';

export default Links;