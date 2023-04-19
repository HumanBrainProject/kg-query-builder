package eu.ebrains.kg.querybuilder.constants;

public class SchemaFieldsConstants {
    public static final String SCHEMA_ORG = "http://schema.org/";

    public static final String IDENTIFIER = SCHEMA_ORG + "identifier";
    public static final String ALTERNATENAME = SCHEMA_ORG + "alternateName";
    public static final String NAME = SCHEMA_ORG + "name";
    public static final String DESCRIPTION = SCHEMA_ORG + "description";
    public static final String GIVEN_NAME = SCHEMA_ORG + "givenName";
    public static final String FAMILY_NAME = SCHEMA_ORG + "familyName";
    public static final String EMAIL = SCHEMA_ORG + "email";

    public static final String EBRAINS = "https://core.kg.ebrains.eu/";
    public static final String VOCAB = EBRAINS + "vocab/";
    public static final String META = VOCAB + "meta/";

    public static final String META_USER = META + "user";
    public static final String META_PERMISSIONS = META + "permissions";
    public static final String META_SPACE = META + "space/";
    public static final String META_COLOR = META + "color";
    public static final String META_PROPERTIES = META + "properties";
    public static final String META_TARGET_TYPES = META + "targetTypes";
    public static final String META_TYPE = META + "type";
    public static final String META_SOURCE_TYPES = META + "sourceTypes";
    public static final String META_INCOMING_LINKS = META + "incomingLinks";
    public static final String META_INTERNAL_SPACE = META_SPACE + "internalSpace";
    public static final String META_NAME_REVERSE_LINK = META + "nameForReverseLink";
}
