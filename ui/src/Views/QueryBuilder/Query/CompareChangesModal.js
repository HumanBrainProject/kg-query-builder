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

import React from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import Modal from "react-bootstrap/Modal";
import { Scrollbars } from "react-custom-scrollbars";

import CompareChanges from "./CompareChanges";

import { useStores } from "../../../Hooks/UseStores";

const useStyles = createUseStyles({
  modal:{
    width:"90%",
    "@media screen and (min-width:1024px)": {
      width:"900px",
    },
    "& .modal-body": {
      height: "calc(95vh - 112px)",
      padding: "3px 0"
    }
  },
  body:{
    height: "100%",
    padding: "20px",
    "& pre": {
      border: 0,
      margin: 0,
      padding: 0,
      display: "inline",
      background: "transparent",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      "& span": {
        whiteSpace: "pre-wrap"
      }
    }
  }
});

const CompareChangesModal = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleHide = () => queryBuilderStore.toggleCompareChanges();

  if (!queryBuilderStore.compareChanges) {
    return null;
  }

  return (
    <Modal show={true} dialogClassName={classes.modal} onHide={handleHide}>
      <Modal.Header closeButton>
        <strong>{queryBuilderStore.queryId}</strong>
      </Modal.Header>
      <Modal.Body>
        <div className={classes.body}>
          <Scrollbars autoHide>
            <CompareChanges />
          </Scrollbars>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default CompareChangesModal;