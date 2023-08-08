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

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons/faRedoAlt';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons/faUndoAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import uniqueId from 'lodash/uniqueId';
import { observer } from 'mobx-react-lite';
import React, { useRef, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { createUseStyles } from 'react-jss';
import type { MouseEvent } from 'react';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'inline-block'
  },
  button: {
    position: 'relative',
    minWidth: '1.1em',
    margin: 0,
    padding: 0,
    border: 0,
    backgroundColor: 'transparent',
    outline: 0
  },
  popOver: {
    background: '#0a2332',
    border: '1px solid var(--list-border-hover)',
    '& .arrow:after': {
      borderBottomColor: 'var(--list-border-hover) !important'
    }
  },
  popOverContent: {
    margin: '20px 0',
    color: 'var(--ft-color-loud)'
  },
  popOverCloseButton: {
    position: 'absolute',
    top: '3px',
    right: '3px',
    color: 'var(--ft-color-loud)',
    backgroundColor: 'transparent',
    border: 'transparent'
  },
  popOverFooterBar: {
    marginBottom: '10px',
    width: '100%',
    textAlign: 'center',
    wordBreak: 'keep-all',
    whiteSpace: 'nowrap',
    '& button + button': {
      marginLeft: '20px'
    }
  }
});

interface PopOverButtonProps {
  className: string;
  buttonClassName: string;
  buttonTitle: string;
  children: React.ReactNode;
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  onOk: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PopOverButton = observer(
  ({
    className,
    buttonClassName,
    buttonTitle,
    children,
    onCancel,
    onOk
  }: PopOverButtonProps) => {
    const classes = useStyles();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [showPopOver, setShowPopOver] = useState(false);

    useEffect(() =>
      () => {
        if (showPopOver) {
          setShowPopOver(false);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    , [showPopOver]);

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPopOver(prevShowPopOver => !prevShowPopOver);
    };

    const handlePopOverClose = (e: MouseEvent<HTMLButtonElement> | Event) => {
      e.stopPropagation();
      setShowPopOver(false);
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPopOver(false);
      onCancel(e);
    };

    const handleOkClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPopOver(false);
      onOk(e);
    };

    return (
      <div className={`${classes.container} ${className ? className : ''}`}>
        <button
          className={`${classes.button} ${
            buttonClassName ? buttonClassName : ''
          }`}
          onClick={handleButtonClick}
          title={buttonTitle}
          ref={buttonRef}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </button>
        <Overlay
          show={showPopOver}
          target={buttonRef.current}
          placement="bottom"
          container={document.body}
          rootClose={true}
          onHide={handlePopOverClose}
        >
          <Popover id={uniqueId('popover')} className={classes.popOver}>
            <div>
              <div className={classes.popOverContent}>{children}</div>
              <div className={classes.popOverFooterBar}>
                <Button size="sm" onClick={handleCancelClick}>
                  <FontAwesomeIcon icon={faUndoAlt} />
                  &nbsp;Cancel
                </Button>
                <Button variant={'primary'} size="sm" onClick={handleOkClick}>
                  <FontAwesomeIcon icon={faRedoAlt} />
                  &nbsp;Retry
                </Button>
              </div>
              <button
                className={classes.popOverCloseButton}
                onClick={handlePopOverClose}
                title="close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </Popover>
        </Overlay>
      </div>
    );
  }
);
PopOverButton.displayName = 'PopOverButton';

export default PopOverButton;
