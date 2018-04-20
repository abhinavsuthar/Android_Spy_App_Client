"use strict";

const parserUtil = require("./parser");
const serializerUtil = require("./serializer");
const detector = require("./detector");

const makeUtils = schema => {
  return {
    parse: parserUtil(schema),
    serialize: serializerUtil(schema),
    detect: detector
  };
};

module.exports = makeUtils;
