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

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Property {
    private String simpleAttributeName;
    private String attribute;
    private String label;
    private List<String> canBe;
    private Boolean reverse;

    public String getSimpleAttributeName() {
        return simpleAttributeName;
    }

    public void setSimpleAttributeName(String simpleAttributeName) {
        this.simpleAttributeName = simpleAttributeName;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<String> getCanBe() {
        return canBe;
    }

    public void setCanBe(List<String> canBe) {
        this.canBe = canBe;
    }

    public Boolean getReverse() {
        return reverse;
    }

    public void setReverse(Boolean reverse) {
        this.reverse = reverse;
    }

    public Property(String simpleAttributeName, String attribute, String label, List<String> canBe) {
        this.simpleAttributeName = simpleAttributeName;
        this.attribute = attribute;
        this.label = label;
        this.canBe = canBe;
    }

    public Property(String simpleAttributeName, String attribute, String label, List<String> canBe, Boolean reverse) {
        this.simpleAttributeName = simpleAttributeName;
        this.attribute = attribute;
        this.label = label;
        this.canBe = canBe;
        this.reverse = reverse;
    }

    public static Property fromMap(Map d) {
        String attribute = (String) (d.get(SchemaFieldsConstants.IDENTIFIER));
        String simpleAttributeName = extractSimpleAttributeName(attribute);
        String label = (String) (d.get(SchemaFieldsConstants.NAME));
        List<Map<String, Object>> canBeMap = (List<Map<String, Object>>) d.get(SchemaFieldsConstants.META_TARGET_TYPES);
        List<String> canBe = null;
        if(canBeMap!=null){
            canBe = canBeMap.stream().map(p -> (String)p.get(SchemaFieldsConstants.META_TYPE)).collect(Collectors.toList());
        }
        return new Property(simpleAttributeName, attribute, label, canBe);
    }

    public static Property fromIncomingLinksMap(Map d, Map propertyReverseLink) {
        String attribute = (String) (d.get(SchemaFieldsConstants.IDENTIFIER));
        String simpleAttributeName = extractSimpleAttributeName(attribute);
        String label = propertyReverseLink.get(attribute) != null? (String) propertyReverseLink.get(attribute):(String) (d.get(SchemaFieldsConstants.NAME));
        List<Map<String, Object>> canBeMap = (List<Map<String, Object>>) d.get(SchemaFieldsConstants.META_SOURCE_TYPES);
        List<String> canBe = null;
        if(canBeMap!=null){
            canBe = canBeMap.stream().map(p -> (String)p.get(SchemaFieldsConstants.META_TARGET_TYPES)).collect(Collectors.toList());
        }
        return new Property(simpleAttributeName, attribute, label, canBe, true);
    }

    private static String extractSimpleAttributeName(String attribute) {
        String simpleAttributeName;
        if (attribute.startsWith("@")) {
            simpleAttributeName = attribute.replace("@", "");
        } else {
            String[] splittedAttribute = attribute.split("/");
            simpleAttributeName = splittedAttribute[splittedAttribute.length - 1];
        }
        return simpleAttributeName;
    }

    public void merge(Property p){
        if(p!=null) {
            if (this.getCanBe() != null && p.getCanBe()!=null){
                this.getCanBe().addAll(p.getCanBe());
                this.setCanBe(this.getCanBe().stream().distinct().sorted().collect(Collectors.toList()));
            }
            else if(p.getCanBe()!=null){
                this.setCanBe(p.getCanBe());
            }
        }
    }

}
