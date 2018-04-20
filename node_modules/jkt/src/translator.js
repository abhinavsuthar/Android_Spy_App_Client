"use strict";

const detector = require("./utils/detector");

const customValueTranslator = callbackFunc => {
  if (!detector.isFunction(callbackFunc))
    throw new TypeError(
      "You have to supply callback function with one parameter as given value to translate"
    );

  const translateFunc = function() {};
  translateFunc.isJKTTRANSLATOR = true;
  translateFunc.translate = value => {
    return callbackFunc(value);
  };

  return translateFunc;
};

module.exports = {
  custom: customValueTranslator
};
