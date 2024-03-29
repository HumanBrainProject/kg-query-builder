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

import { observer } from 'mobx-react-lite';
import React  from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { createUseStyles } from 'react-jss';

import Filter from '../../../../Components/Filter';
import Toggle from '../../../../Components/Toggle';
import useStores from '../../../../Hooks/useStores';

import Groups from './Properties/Groups';
import List from './Properties/List';
import type { QuerySpecification } from '../../../../Types/QuerySpecification';
import type { Property } from '../../../../types';
import type { MouseEvent } from 'react';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    height: '100%',
    color: 'var(--ft-color-normal)',
    '& input': {
      color: 'black'
    },
    '& hr': {
      margin: '30px auto',
      maxWidth: '500px',
      borderTopColor: 'var(--bg-color-ui-contrast4)'
    },
    '&.has-options': {
      marginTop: '10px',
      '& $panel': {
        height: 'calc(100% - 25px)'
      }
    }
  },
  panel: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    border: '1px solid var(--bg-color-ui-contrast1)',
    height: '100%'
  },
  filter: {
    border: 0,
    background: 'linear-gradient(90deg, rgba(20,50,60,0.2) 0%, rgba(20,50,60,0.4) 100%)'
  },
  body: {
    padding: '0 10px 10px 10px',
    borderTop: '1px solid var(--bg-color-ui-contrast1)'
  },
  advancedPropertiesToggle: {
    padding: '10px',
    borderTop: '1px solid var(--bg-color-ui-contrast1)'
  }
});

const Properties = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const field = queryBuilderStore.currentField;

  if (!field || !queryBuilderStore.currentFieldLookups.length) {
    return null;
  }

  const lookupsCommonsAttributes = queryBuilderStore.currentFieldLookupsCommonAttributes;
  const lookupsAttributes = queryBuilderStore.currentFieldLookupsAttributes;
  const lookupsCommonsLinks = queryBuilderStore.currentFieldLookupsCommonLinks;
  const lookupsLinks = queryBuilderStore.currentFieldLookupsLinks;

  const handleAddField = (e: MouseEvent<HTMLElement>, property: Property) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    const schema = {
      ...property,
      isUnknown: false
    } as QuerySpecification.Schema;
    queryBuilderStore.addField(schema, field, !e.ctrlKey && !e.metaKey);
  };

  const handleChildrenFilterChange = (value: string) => queryBuilderStore.setChildrenFilterValue(value);

  const handleToggleAdvancedProperties = () => queryBuilderStore.toggleIncludeAdvancedAttributes();

  return (
    <div className={`${classes.container} ${queryBuilderStore.currentField === queryBuilderStore.rootField?'':'has-options'}`}>
      <div className={classes.panel}>
        <Filter className={classes.filter} value={queryBuilderStore.childrenFilterValue} placeholder="Filter properties" onChange={handleChildrenFilterChange} />
        <div className={classes.body}>
          <Scrollbars autoHide>
            <List
              properties={lookupsCommonsAttributes}
              label="Attributes"
              onClick={handleAddField}
            />
            <Groups
              groups={lookupsAttributes}
              prefix="Attributes specific to"
              onClick={handleAddField}
            />
            <List
              properties={lookupsCommonsLinks}
              label="Links"
              onClick={handleAddField}
            />
            <Groups
              groups={lookupsLinks}
              prefix="Links specific to"
              onClick={handleAddField}
            />
          </Scrollbars>
        </div>
        <div className={classes.advancedPropertiesToggle} >
          <Toggle
            label="Show advanced properties"
            option={{
              name: 'Show advanced properties',
              value: queryBuilderStore.includeAdvancedAttributes?true:undefined
            }}
            show={true}
            onChange={handleToggleAdvancedProperties} />
        </div>
      </div>
    </div>
  );
});
Properties.displayName = 'Properties';

export default Properties;