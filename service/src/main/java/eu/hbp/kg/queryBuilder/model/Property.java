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
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Property {
    private Double numOfOccurennces;
    private String simpleAttributeName;
    private String attribute;
    private String label;
    private List<Map> canBe;
    private Boolean reverse;

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

    public List<Map> getCanBe() {
        return canBe;
    }

    public void setCanBe(List<Map> canBe) {
        this.canBe = canBe;
    }

    public Boolean getReverse() {
        return reverse;
    }

    public void setReverse(Boolean reverse) {
        this.reverse = reverse;
    }

    public Property(Double numOfOccurennces, String simpleAttributeName, String attribute, String label, List<Map> canBe) {
        this.numOfOccurennces = numOfOccurennces;
        this.simpleAttributeName = simpleAttributeName;
        this.attribute = attribute;
        this.label = label;
        this.canBe = canBe;
    }

    public Property(String simpleAttributeName, String attribute, String label, List<Map> canBe, Boolean reverse) {
        this.simpleAttributeName = simpleAttributeName;
        this.attribute = attribute;
        this.label = label;
        this.canBe = canBe;
        this.reverse = reverse;
    }

    public static Property fromMap(Map d) {
        Double numOfOccurennces = (Double) (d.get(SchemaFieldsConsts.META_OCCURRENCES));
        String attribute = (String) (d.get(SchemaFieldsConsts.ID));
        String simpleAttributeName = extractSimpleAttributeName(attribute);
        String label = (String) (d.get(SchemaFieldsConsts.NAME));
        List<Map> canBe = (List<Map>) d.get(SchemaFieldsConsts.META_TARGET_TYPES);
        return new Property(numOfOccurennces, simpleAttributeName, attribute, label, canBe);
    }

    public static Property fromIncomingLinksMap(Map d) {
        String attribute = (String) (d.get(SchemaFieldsConsts.ID));
        String simpleAttributeName = extractSimpleAttributeName(attribute);
        String label = (String) (d.get(SchemaFieldsConsts.NAME));
        List<Map> canBe = (List<Map>) d.get(SchemaFieldsConsts.META_SOURCE_TYPES);
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

}
