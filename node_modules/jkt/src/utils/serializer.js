"use strict";

const detector = require("./detector");
const extractMapKey = require("./mapkey_extractor");
const {
  STRING,
  ARRAY,
  BOOLEAN,
  DATE,
  DATE_PLAIN,
  FUNCTION,
  NUMBER,
  OBJECT,
  ANY
} = require("../datatypes");

const isSafeToRelease = typeName =>
  [STRING, NUMBER, DATE, DATE_PLAIN, BOOLEAN].includes(typeName);

const safeSerializer = {
  [STRING]: val => val,
  [NUMBER]: val => val,
  [DATE]: val => (val ? val.toJSON() : null), // ISO-8601 UTC
  [DATE_PLAIN]: val => (val ? val.toJSON() : null), // ISO-8601 UTC
  [BOOLEAN]: val => val
};

const purified = obj => {
  try {
    const parsed = JSON.parse(JSON.stringify(obj));
    return parsed;
  } catch (err) {
    return undefined;
  }
};

const serialize = baseSchema => {
  return parsedValues => {
    const serializedValues = {};
    Object.keys(baseSchema).forEach(key => {
      const valueType = baseSchema[key];

      const [srcKey, mapKey] = extractMapKey(key);
      if (mapKey !== null) key = mapKey;

      const value = parsedValues[key];
      if (!detector.isUndefined(value))
        if (isSafeToRelease(valueType)) {
          serializedValues[key] = safeSerializer[valueType](value);
        } else {
          const purifiedVal = purified(value);
          if (!detector.isUndefined(purifiedVal))
            serializedValues[key] = purifiedVal;
        }
    });
    return serializedValues;
  };
};

module.exports = serialize;
