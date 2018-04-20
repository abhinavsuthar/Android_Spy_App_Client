"use strict";

const { generator } = require("./utils");
const Splitter = require("./splitter");
const {
  hasReservedKeys,
  triggerErrorReservedKeys
} = require("./reserved_keys");

const extendBuilder = (__id, baseSchema, strict) => {
  const splitter = Splitter(strict);
  return (childStrings, ...childBindings) => {
    const { makeUtils } = require("./utils");
    const { Inst } = require("./index");
    const childSchema = splitter(childStrings, childBindings);
    const newSchema = Object.assign({}, baseSchema, childSchema);

    if (hasReservedKeys(newSchema)) triggerErrorReservedKeys();

    const childId = generator.generateId();
    const newId = __id.concat([childId]);
    return Inst(newId, newSchema, makeUtils(newSchema));
  };
};

module.exports = extendBuilder;
