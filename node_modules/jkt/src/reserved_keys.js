"use strict";

const RESERVED_KEYS = [
  "getSchema",
  "j",
  "toJSON",
  "toString",
  "getDirtySchema",
  "instanceOf"
];

const hasReservedKeys = obj => {
  return Object.keys(obj).filter(key => RESERVED_KEYS.includes(key)).length > 0;
};

const triggerErrorReservedKeys = () => {
  throw new Error(
    `Any properties and methods with name ${RESERVED_KEYS.join(
      ", "
    )} are reserved`
  );
};

module.exports = {
  RESERVED_KEYS,
  hasReservedKeys,
  triggerErrorReservedKeys
};
