export type Serializable = string | number | boolean | null | SerializableArray | SerializableHash;

export type SerializableArray = Serializable[];

export type SerializableHash = { [key: string]: Serializable };
