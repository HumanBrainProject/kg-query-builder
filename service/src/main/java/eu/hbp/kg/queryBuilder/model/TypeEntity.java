package eu.hbp.kg.queryBuilder.model;

import java.util.List;

public class TypeEntity {
    private String id;
    private String label;
//    private List<Property> properties;

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

//    public List<Property> getProperties() {
//        return properties;
//    }
//
//    public void setProperties(List<Property> properties) {
//        this.properties = properties;
//    }

    public TypeEntity(String id, String label) {
        this.id = id;
        this.label = label;
//        this.properties = properties;
    }
//
//    public TypeEntity(String id, String label, List<Property> properties) {
//        this.id = id;
//        this.label = label;
//        this.properties = properties;
//    }
}
