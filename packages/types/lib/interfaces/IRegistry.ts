export interface Registry<K extends string | symbol = string, Value = unknown> {
    register(key: K, value: Value): Registry;
    request(key: K): Value | null;
}