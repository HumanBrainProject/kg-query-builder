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

import java.util.List;
import java.util.Map;

public class Property {
    private Double numOfOccurennces;
    private String simpleAttributeName;
    private String attribute;
    private String label;
    private List<String> canBe;

    public Double getNumOfOccurennces() {
        return numOfOccurennces;
    }

    public void setNumOfOccurennces(Double numOfOccurennces) {
        this.numOfOccurennces = numOfOccurennces;
    }

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

    public Property(Double numOfOccurennces, String simpleAttributeName, String attribute, String label, List<String> canBe) {
        this.numOfOccurennces = numOfOccurennces;
        this.simpleAttributeName = simpleAttributeName;
        this.attribute = attribute;
        this.label = label;
        this.canBe = canBe;
    }

    public static Property fromMap(Map d) {
        Double numOfOccurennces = (Double)(d.get(SchemaFieldsConsts.META_OCCURRENCES));
        String attribute = (String)(d.get(SchemaFieldsConsts.ID));
        String simpleAttributeName;
        if(attribute.startsWith("@")) {
            simpleAttributeName = attribute.replace("@", "");
        } else {
            String[] splittedAttribute = attribute.split("/");
            simpleAttributeName = splittedAttribute[splittedAttribute.length - 1];
        }
        String label = (String)(d.get(SchemaFieldsConsts.NAME));
        List<String> canBe = (List<String>) (d.get(SchemaFieldsConsts.META_TARGET_TYPES));
        return new Property(numOfOccurennces, simpleAttributeName, attribute, label, canBe);
    }

}
