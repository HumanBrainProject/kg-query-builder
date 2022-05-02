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

package eu.ebrains.kg.queryBuilder.model;

import eu.ebrains.kg.queryBuilder.constants.SchemaFieldsConstants;

import java.util.*;
import java.util.stream.Collectors;

public class TypeEntity {
    private String id;
    private String label;
    private String color;
    private List<Property> properties;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

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
        String id = (String) (d.get(SchemaFieldsConstants.IDENTIFIER));
        String name = (String) (d.get(SchemaFieldsConstants.NAME));
        String color = (String) (d.get(SchemaFieldsConstants.META_COLOR));
        List<Property> properties = ((Collection<?>) d.get(SchemaFieldsConstants.META_PROPERTIES)).stream()
                .filter(p -> p instanceof Map)
                .map(p -> Property.fromMap((Map<?, ?>) p))
                .collect(Collectors.toList());
        Map<String, String> propertyReverseLink = ((Collection<?>) d.get(SchemaFieldsConstants.META_PROPERTIES)).stream()
                .filter(p -> p instanceof Map)
                .map(p -> (Map<?, ?>) p)
                .filter(f -> f.get(SchemaFieldsConstants.META_NAME_REVERSE_LINK) != null)
                .collect(Collectors.toMap(k-> ((String) k.get(SchemaFieldsConstants.IDENTIFIER)), v-> ((String) v.get(SchemaFieldsConstants.META_NAME_REVERSE_LINK))));
        List<Property> incomingLinksProperties = ((Collection<?>) d.get(SchemaFieldsConstants.META_INCOMING_LINKS)).stream()
                .filter(p -> p instanceof Map)
                .map(p -> Property.fromIncomingLinksMap((Map<?, ?>) p, propertyReverseLink))
                .collect(Collectors.toList());
        properties.addAll(incomingLinksProperties);
        return new TypeEntity(id, name, color, properties);
    }

    private String getDistinctPropertyKey(Property p){
       return String.format("%s-%b", p.getAttribute(), p.getReverse());
    }

    public void mergeWith(TypeEntity typeEntity){
        final Map<String, Property> mappedProperties = typeEntity.getProperties().stream().collect(Collectors.toMap(this::getDistinctPropertyKey, v -> v));
        Set<String> handledProperties = new HashSet<>();
        this.properties.forEach(p -> {
            final String distinctPropertyKey = getDistinctPropertyKey(p);
            if(mappedProperties.containsKey(distinctPropertyKey)){
                p.merge(mappedProperties.get(distinctPropertyKey));
            }
            handledProperties.add(p.getAttribute());
        });
        typeEntity.getProperties().stream().filter(p -> !handledProperties.contains(p.getAttribute())).forEach(p->this.properties.add(p));
    }

}
