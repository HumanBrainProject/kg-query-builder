/*
 * Copyright 2020 EPFL/Human Brain Project PCO
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package eu.hbp.kg.queryBuilder.model;

import eu.hbp.kg.queryBuilder.constants.SchemaFieldsConsts;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TypeEntity {
    private String id;
    private String label;

    public String getColor() { return color; }

    public void setColor(String color) { this.color = color; }

    private String color;
    private List<Property> properties;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Property> getProperties() {
        return properties;
    }

    public void setProperties(List<Property> properties) {
        this.properties = properties;
    }

    public TypeEntity(String id, String label, String color, List<Property> properties) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.properties = properties;
    }

    public static TypeEntity fromMap(Map d) {
        String id = (String) (d.get(SchemaFieldsConsts.ID));
        String name = (String) (d.get(SchemaFieldsConsts.NAME));
        String color = (String) (d.get(SchemaFieldsConsts.META_COLOR));
        List<Property> properties = ((Collection<?>) d.get(SchemaFieldsConsts.META_PROPERTIES)).stream().filter(p -> p instanceof Map).map(p -> (Map<?,?>) p).map(Property::fromMap).collect(Collectors.toList());
        return new TypeEntity(id, name, color, properties);
    }
}
