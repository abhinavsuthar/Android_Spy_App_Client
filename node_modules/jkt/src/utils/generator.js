"use strict";

const shortId = require("shortid");

shortId.seed(1831);

const generateId = () => {
  return shortId.generate();
};

module.exports = {
  generateId
};
