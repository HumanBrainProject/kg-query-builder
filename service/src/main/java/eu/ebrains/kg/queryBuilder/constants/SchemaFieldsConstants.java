package eu.ebrains.kg.queryBuilder.constants;

public class SchemaFieldsConstants {
    public static final String SCHEMA_ORG = "http://schema.org/";
    public static final String SCHEMA_HBP = "https://schema.hbp.eu/";

    public static final String USER_ID = SCHEMA_HBP + "users/nativeId";
    public static final String USER_PICTURE = SCHEMA_HBP + "users/picture";

    public static final String IDENTIFIER = SCHEMA_ORG + "identifier";
    public static final String ALTERNATENAME = SCHEMA_ORG + "alternateName";
    public static final String NAME = SCHEMA_ORG + "name";
    public static final String GIVEN_NAME = SCHEMA_ORG + "givenName";
    public static final String FAMILY_NAME = SCHEMA_ORG + "familyName";
    public static final String EMAIL = SCHEMA_ORG + "email";
    public static final String PICTURE = SCHEMA_ORG + "picture";
    public static final String CURATOR = SCHEMA_HBP + "curator";
    public static final String EBRAINS = "https://core.kg.ebrains.eu/";
    public static final String VOCAB = EBRAINS + "vocab/";
    public static final String META = VOCAB + "meta/";
    public static final String META_USER = META + "user";
    public static final String META_PERMISSIONS = META + "permissions";
    public static final String META_SPACE = META + "space/";
    public static final String META_COLOR = META + "color";
    public static final String META_PROPERTIES = META + "properties";
    public static final String META_OCCURRENCES = META + "occurrences";
    public static final String META_TARGET_TYPES = META + "targetTypes";
    public static final String META_SOURCE_TYPES = META + "sourceTypes";
    public static final String META_INCOMING_LINKS = META + "incomingLinks";
    public static final String META_CLIENT_SPACE = META_SPACE + "clientSpace";
    public static final String META_INTERNAL_SPACE = META_SPACE + "internalSpace";
    public static final String META_NAME_REVERSE_LINK = META + "nameForReverseLink";
}
