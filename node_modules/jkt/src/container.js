"use strict";

const loValues = require("lodash/values");
const { isJKTObject, isArray, isNull } = require("./utils/detector");

const baseContainerData = {
  isContainer: true
};

const arrayContainer = (value, strictNull = false) => {
  const obj = Object.assign({}, baseContainerData, {
    parse: (valueParser, valueToParse) => {
      if (isArray(valueToParse)) {
        const parsedValues = [];
        valueToParse.forEach(valueToParse => {
          if (isJKTObject(value)) {
            const p = valueParser(value.__schema, valueToParse);
            let hasNotNullValue = false;
            loValues(p).forEach(v => {
              if (!isNull(v)) hasNotNullValue = true;
            });
            if (strictNull) {
              if (hasNotNullValue) parsedValues.push(p);
            } else {
              parsedValues.push(p);
            }
          } else {
            parsedValues.push(valueToParse);
          }
        });
        return parsedValues;
      } else {
        return [];
      }
    }
  });

  return obj;
};

module.exports = {
  arr: arrayContainer
};
