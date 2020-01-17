package eu.hbp.kg.queryBuilder.model;

public enum ServiceClient {
    CLIENTID("kg-editor");

    private ServiceClient(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    private final String name;
}
