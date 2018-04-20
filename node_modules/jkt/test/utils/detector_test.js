"use strict";
const moment = require("moment");
const chai = require("chai");
const jkt = require(`${src}/index`);
const detector = require(`${src}/utils/detector`);

const expect = chai.expect;

describe("Util Detector", () => {
  it("should be able to check array type", () => {
    expect(detector.isArray([])).to.be.true;
    expect(detector.isArray({})).to.be.false;
    expect(detector.isArray(123)).to.be.false;
    expect(detector.isArray('abc')).to.be.false;
  })
  it("should be able to check object type", () => {
    class Person {}
    const person = new Person();
    expect(detector.isObject({})).to.be.true;
    expect(detector.isObject(person)).to.be.true;
    expect(detector.isObject([])).to.be.false;
    expect(detector.isObject(() => 'some value')).to.be.false;
    expect(detector.isObject(123)).to.be.false;
    expect(detector.isObject('abc')).to.be.false;
  })
  it("should be able to check function type", () => {
    const plus = (num1, num2) => (num1 + num2);
    function divide(num1, num2) { return num1 / num2 };
    expect(detector.isFunction(plus)).to.be.true;
    expect(detector.isFunction(divide)).to.be.true;
    expect(detector.isFunction({})).to.be.false;
    expect(detector.isFunction([])).to.be.false;
    expect(detector.isFunction(123)).to.be.false;
    expect(detector.isFunction('abc')).to.be.false;
  })
  it("should be able to check string type", () => {
    expect(detector.isString('some string')).to.be.true;
    expect(detector.isString({})).to.be.false;
    expect(detector.isString([])).to.be.false;
    expect(detector.isString(123)).to.be.false;
    expect(detector.isString(() => 'some value')).to.be.false;
  })
  it("should be able to check number type", () => {
    expect(detector.isNumber(937283)).to.be.true;
    expect(detector.isNumber(1234.546)).to.be.true;
    expect(detector.isNumber({})).to.be.false;
    expect(detector.isNumber([])).to.be.false;
    expect(detector.isNumber(() => 'some value')).to.be.false;
  })
  it("should be able to check boolean type", () => {
    expect(detector.isBoolean(true)).to.be.true;
    expect(detector.isBoolean(false)).to.be.true;
    expect(detector.isBoolean(937283)).to.be.false;
    expect(detector.isBoolean(1234.546)).to.be.false;
    expect(detector.isBoolean({})).to.be.false;
    expect(detector.isBoolean([])).to.be.false;
    expect(detector.isBoolean(() => 'some value')).to.be.false;
  })
  it("should be able to check null type", () => {
    expect(detector.isNull(null)).to.be.true;
    expect(detector.isNull(undefined)).to.be.false;
    expect(detector.isNull('')).to.be.false;
    expect(detector.isNull(937283)).to.be.false;
    expect(detector.isNull(1234.546)).to.be.false;
    expect(detector.isNull({})).to.be.false;
    expect(detector.isNull([])).to.be.false;
    expect(detector.isNull(() => 'some value')).to.be.false;
  })
  it("should be able to check date type", () => {
    expect(detector.isDate(new Date())).to.be.true;
    expect(detector.isDate(null)).to.be.false;
    expect(detector.isDate(undefined)).to.be.false;
    expect(detector.isDate('')).to.be.false;
    expect(detector.isDate(937283)).to.be.false;
    expect(detector.isDate(1234.546)).to.be.false;
    expect(detector.isDate({})).to.be.false;
    expect(detector.isDate([])).to.be.false;
    expect(detector.isDate(() => 'some value')).to.be.false;
  })
  it("should be able to check date type", () => {
    const x = {a: { b: 'c'}}
    expect(detector.isUndefined(undefined)).to.be.true;
    expect(detector.isUndefined(x.a.c)).to.be.true;
    expect(detector.isUndefined(new Date())).to.be.false;
    expect(detector.isUndefined(null)).to.be.false;
    expect(detector.isUndefined('')).to.be.false;
    expect(detector.isUndefined(937283)).to.be.false;
    expect(detector.isUndefined(1234.546)).to.be.false;
    expect(detector.isUndefined({})).to.be.false;
    expect(detector.isUndefined([])).to.be.false;
    expect(detector.isUndefined(() => 'some value')).to.be.false;
  })
  it("should be able to check error type", () => {
    expect(detector.isError(new Error('some message'))).to.be.true;
    expect(detector.isError(new TypeError('error type'))).to.be.true;
    expect(detector.isError(new Date())).to.be.false;
    expect(detector.isError(null)).to.be.false;
    expect(detector.isError('')).to.be.false;
    expect(detector.isError(937283)).to.be.false;
    expect(detector.isError(1234.546)).to.be.false;
    expect(detector.isError({})).to.be.false;
    expect(detector.isError([])).to.be.false;
    expect(detector.isError(() => 'some value')).to.be.false;
  })
  it("should be able to check symbol type", () => {
    expect(detector.isSymbol(Symbol('some key'))).to.be.true;
    expect(detector.isSymbol(new Date())).to.be.false;
    expect(detector.isSymbol(null)).to.be.false;
    expect(detector.isSymbol('')).to.be.false;
    expect(detector.isSymbol(937283)).to.be.false;
    expect(detector.isSymbol(1234.546)).to.be.false;
    expect(detector.isSymbol({})).to.be.false;
    expect(detector.isSymbol([])).to.be.false;
    expect(detector.isSymbol(() => 'some value')).to.be.false;
  })
  it("should be able to check integer type", () => {
    expect(detector.isInt(12345)).to.be.true;
    expect(detector.isInt(12345.678)).to.be.false;
    expect(detector.isInt(new Date())).to.be.false;
    expect(detector.isInt(null)).to.be.false;
    expect(detector.isInt('')).to.be.false;
    expect(detector.isInt({})).to.be.false;
    expect(detector.isInt([])).to.be.false;
    expect(detector.isInt(() => 'some value')).to.be.false;
  })
  it("should be able to check float type", () => {
    expect(detector.isFloat(12345.678)).to.be.true;
    expect(detector.isFloat(12345)).to.be.false;
    expect(detector.isFloat(new Date())).to.be.false;
    expect(detector.isFloat(null)).to.be.false;
    expect(detector.isFloat('')).to.be.false;
    expect(detector.isFloat({})).to.be.false;
    expect(detector.isFloat([])).to.be.false;
    expect(detector.isFloat(() => 'some value')).to.be.false;
  })
  it("should be able to check string with float number", () => {
    expect(detector.isStringFloat('12345.678')).to.be.true;
    expect(detector.isStringFloat(12345.678)).to.be.false;
    expect(detector.isStringFloat(12345)).to.be.false;
    expect(detector.isStringFloat(new Date())).to.be.false;
    expect(detector.isStringFloat(null)).to.be.false;
    expect(detector.isStringFloat('')).to.be.false;
    expect(detector.isStringFloat({})).to.be.false;
    expect(detector.isStringFloat([])).to.be.false;
    expect(detector.isStringFloat(() => 'some value')).to.be.false;
  })
  it("should be able to check jkt object", () => {
    const Person = jkt`name: String, age: Number`;

    expect(detector.isJKTObject(Person)).to.be.true;
    expect(detector.isJKTObject(12345.678)).to.be.false;
    expect(detector.isJKTObject(12345)).to.be.false;
    expect(detector.isJKTObject(new Date())).to.be.false;
    expect(detector.isJKTObject(null)).to.be.false;
    expect(detector.isJKTObject('')).to.be.false;
    expect(detector.isJKTObject({})).to.be.false;
    expect(detector.isJKTObject([])).to.be.false;
    expect(detector.isJKTObject(() => 'some value')).to.be.false;
  })
  it("should be able to check enum object", () => {
    const Colors = jkt.ENUM`red, green, blue`;
    const Person = jkt`name: String, age: Number`;

    expect(detector.isENUMObject(Colors)).to.be.true;
    expect(detector.isENUMObject(Person)).to.be.false;
    expect(detector.isENUMObject(12345.678)).to.be.false;
    expect(detector.isENUMObject(12345)).to.be.false;
    expect(detector.isENUMObject(new Date())).to.be.false;
    expect(detector.isENUMObject(null)).to.be.false;
    expect(detector.isENUMObject('')).to.be.false;
    expect(detector.isENUMObject({})).to.be.false;
    expect(detector.isENUMObject([])).to.be.false;
    expect(detector.isENUMObject(() => 'some value')).to.be.false;
  })
  it("should be able to check translator object", () => {
    const Person = jkt`name: String, age: Number`;
    const Colors = jkt.ENUM`red, green, blue`;
    const transFunc = jkt.trans.custom(name => `Hi ${name}, welcome to JKT`);
    
    expect(detector.isTranslatorObject(transFunc)).to.be.true;
    expect(detector.isTranslatorObject(Person)).to.be.false;
    expect(detector.isTranslatorObject(Colors)).to.be.false;
    expect(detector.isTranslatorObject(12345.678)).to.be.false;
    expect(detector.isTranslatorObject(12345)).to.be.false;
    expect(detector.isTranslatorObject(new Date())).to.be.false;
    expect(detector.isTranslatorObject(null)).to.be.false;
    expect(detector.isTranslatorObject('')).to.be.false;
    expect(detector.isTranslatorObject({})).to.be.false;
    expect(detector.isTranslatorObject([])).to.be.false;
    expect(detector.isTranslatorObject(() => 'some value')).to.be.false;
  })
  it('should detect mapping key pattern', () => {
    const mappingStr = 'full_name->nick_name';
    expect(detector.hasMappingKey(mappingStr)).to.be.true;
  })
});
