package eu.hbp.kg.queryBuilder.model;

import java.util.List;

public class Property {
    private String numOfOccurennces;
    private String simpleAttributeName;
    private String attribute;
    private String label;
    private List<String> canBe;

    public String getNumOfOccurennces() {
        return numOfOccurennces;
    }

    public void setNumOfOccurennces(String numOfOccurennces) {
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

    public Property(String numOfOccurennces, String simpleAttributeName, String attribute, String label, List<String> canBe) {
        this.numOfOccurennces = numOfOccurennces;
        this.simpleAttributeName = simpleAttributeName;
        this.attribute = attribute;
        this.label = label;
        this.canBe = canBe;
    }

}
