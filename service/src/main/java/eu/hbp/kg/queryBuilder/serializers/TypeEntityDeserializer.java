package eu.hbp.kg.queryBuilder.serializers;

import com.google.gson.*;
import eu.hbp.kg.queryBuilder.model.TypeEntity;

import java.lang.reflect.Type;

public class TypeEntityDeserializer implements JsonDeserializer<TypeEntity> {

    @Override
    public TypeEntity deserialize(JsonElement json, Type typeOfT,
                                  JsonDeserializationContext context) throws JsonParseException {
        JsonObject object = json.getAsJsonObject();
        return new TypeEntity(object.get("http://schema.org/identifier").getAsString(), object.get("http://schema.org/name").getAsString());
    }
}
