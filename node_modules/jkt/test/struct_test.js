"use strict";

const moment = require("moment");
const chai = require("chai");
const jkt = require(`${src}/index`);
const reservedKeys = require(`${src}/reserved_keys`);

chai.should();
chai.use(require("chai-things"));

const expect = chai.expect;

describe("Struct", () => {
  it("should be able to create by multiple lines", () => {
    const person = jkt`
      name: String
      age: Number
      birthday: Date
    `;

    expect(person.isJKT).to.be.true;
    expect(person.schema).to.deep.equal({
      name: "String",
      age: "Number",
      birthday: "Date"
    });
  });
  it("should be able to create by one liner", () => {
    const person = jkt`name: String,age: Number, birthday: Date`;

    expect(person.isJKT).to.be.true;
    expect(person.schema).to.deep.equal({
      name: "String",
      age: "Number",
      birthday: "Date"
    });
  });
  it("should be able to extend", () => {
    const person = jkt`
      name: String
      age: Number
    `;

    const father = person`
      hasFamily: Boolean
    `;

    const validSchema = {
      name: "String",
      age: "Number",
      hasFamily: "Boolean"
    };

    const schemaFromInst = father({}).getSchema();
    const schemaFromStruct = father.schema;
    expect(schemaFromInst).to.deep.equal(validSchema);
    expect(schemaFromStruct).to.deep.equal(validSchema);
  });
  it("should be able to remove property on extend", () => {
    const person = jkt`
      name: String
      age: Number
      birthday: Date
    `;

    const fruit = person`
      age: !DELETE
      birthday: !DELETE
      color: String
    `;

    const validSchema = {
      name: "String",
      color: "String"
    };

    const schemaFromInst = fruit({}).getSchema();
    expect(schemaFromInst).to.deep.equal(validSchema);
    expect(fruit.schema).to.deep.equal(validSchema);
  });
  it("Should be able to create nested struct", () => {
    const hobby = jkt`
      name: String
      cost: Number
      outdoor: Boolean
    `;

    const person = jkt`
      name: String
      age: Number
      hobby: ${hobby}
    `;

    const mother = jkt`
      gender: String
      beauty: Boolean
      child: ${person}
    `;

    const validSchemaPerson = {
      name: "String",
      age: "Number",
      hobby: {
        name: "String",
        cost: "Number",
        outdoor: "Boolean"
      }
    };

    const validSchemaMother = {
      gender: "String",
      beauty: "Boolean",
      child: validSchemaPerson
    };

    expect(person.schema).to.deep.equal(validSchemaPerson);
    expect(mother.schema).to.deep.equal(validSchemaMother);
  });
  it("Should be able to parse from nested struct", () => {
    const hobby = jkt`
      name: String
      cost: Number
      outdoor: Boolean
    `;

    const person = jkt`
      name: String
      age: Number
      hobby: ${hobby}
      toys: Array
    `;

    const mother = jkt`
      gender: String
      beauty: Boolean
      child: ${person}
    `;

    const parsed = mother({
      gender: "Woman",
      beauty: true,
      child: {
        name: "Dera",
        age: "5.67",
        toys: [1, "dua", 3],
        hobby: {
          name: "Fishing",
          cost: "300",
          outdoor: "yes",
          lalala: "sss"
        }
      }
    });

    expect(parsed.j()).to.deep.equal({
      gender: "Woman",
      beauty: true,
      child: {
        name: "Dera",
        age: 5.67,
        toys: [1, "dua", 3],
        hobby: {
          name: "Fishing",
          cost: 300,
          outdoor: null
        }
      }
    });
  });
  it("should be able to show default values of nested struct", () => {
    const hobby = jkt`
      name: String
      cost: Number
      outdoor: Boolean
    `;

    const person = jkt`
      name: String
      age: Number
      hobby: ${hobby}
      toys: Array
    `;

    const mother = jkt`
      gender: String
      beauty: Boolean
      child: ${person}
    `;

    const sportRule = jkt`
      name: String
      strict: Boolean
      needReferee: Boolean!
    `;

    const sport = jkt`
      fieldSize: Number
      needMultipleTeam: Boolean!
      rule: ${sportRule}
    `;

    const father = jkt`
      gender: String
      loveSport: Boolean
      sport: ${sport}
    `;

    const motherValues = mother({});
    const fatherValues = father({});

    expect(motherValues.j()).to.deep.equal({
      gender: null,
      beauty: null,
      child: {
        name: null,
        age: null,
        toys: null,
        hobby: {
          name: null,
          cost: null,
          outdoor: null
        },
        toys: null
      }
    });

    expect(fatherValues.j()).to.deep.equal({
      gender: null,
      loveSport: null,
      sport: {
        fieldSize: null,
        rule: {
          name: null,
          strict: null
        }
      }
    });
  });
  it("should be able to check instance and parent", () => {
    const person = jkt`
      name: String
      age: Number
      birthday: Date
    `;

    const mother = person`
      doShopping: Boolean
    `;

    const someHuman = mother`
      athlete: Boolean!
    `;

    const m = mother({});
    const p = person({});
    const h = someHuman({});

    expect(m.instanceOf(person)).to.be.true;
    expect(p.instanceOf(mother)).to.be.false;
    expect(h.instanceOf(mother)).to.be.true;
    expect(mother.childOf(person)).to.be.true;
    expect(person.childOf(mother)).to.be.false;
    expect(someHuman.childOf(person)).to.be.true;
    expect(someHuman.childOf(mother)).to.be.true;
  });
  it("should able to parse with forced rules", () => {
    const Animal = jkt`type: String, color: String, beast: Boolean`;
    const Animal2 = jkt`
      type: String
      color: String
      beast: Boolean
    `;
    const Animal3 = jkt`
      type: String,
      color: String,
      beast: Boolean
    `;

    const Animal4 = jkt`
      type: String!
      color: String!
      beast: Boolean
    `;

    expect(Animal.schema).to.deep.equal({
      type: "String",
      color: "String",
      beast: "Boolean"
    });
    expect(Animal2.schema).to.deep.equal({
      type: "String",
      color: "String",
      beast: "Boolean"
    });
    expect(Animal3.schema).to.deep.equal({
      type: "String",
      color: "String",
      beast: "Boolean"
    });
    expect(Animal4.schema).to.deep.equal({
      type: "String!",
      color: "String!",
      beast: "Boolean"
    });
  });
  it("should be able to handle values with container", () => {
    const person = jkt`
      name: String
      age: Number
      birthday: Date
    `;

    const fruit = jkt`
      name: String
      color: String
    `;

    const people = jkt`
      group: String
      people: ${jkt.c.arr(person)}
    `;

    const countryGroup = jkt`
      country: String
      groupOfPeople: ${people}
      fruits: ${jkt.c.arr(fruit)}
    `;

    const peopleStrict = jkt`
      group: String
      people: ${jkt.c.arr(person, true)}
    `;

    const groupOfPeople = people({
      group: "Bike Lover",
      people: [
        {
          name: "Tono"
        },
        {
          name: "Aditya",
          age: "26"
        },
        "sasasa"
      ]
    });

    const groupOfStrictPeople = peopleStrict({
      group: "Bike Lover",
      people: [
        {
          name: "Tono"
        },
        {
          name: "Aditya",
          age: "26"
        },
        "sasasa"
      ]
    });

    const groupOfCountry = countryGroup({
      country: "Indonesia",
      groupOfPeople: {
        group: "Bike Lover",
        people: [
          {
            name: "Tono"
          },
          {
            name: "Aditya",
            age: "26"
          }
        ]
      }
    });

    expect(groupOfPeople.j()).to.deep.equal({
      group: "Bike Lover",
      people: [
        {
          name: "Tono",
          age: null,
          birthday: null
        },
        {
          name: "Aditya",
          age: 26,
          birthday: null
        },
        {
          name: null,
          age: null,
          birthday: null
        }
      ]
    });

    expect(groupOfStrictPeople.j()).to.deep.equal({
      group: "Bike Lover",
      people: [
        {
          name: "Tono",
          age: null,
          birthday: null
        },
        {
          name: "Aditya",
          age: 26,
          birthday: null
        }
      ]
    });

    expect(groupOfCountry.j()).to.deep.equal({
      country: "Indonesia",
      fruits: [],
      groupOfPeople: {
        group: "Bike Lover",
        people: [
          {
            name: "Tono",
            age: null,
            birthday: null
          },
          {
            name: "Aditya",
            age: 26,
            birthday: null
          }
        ]
      }
    });
  });
  it("should be able to handle values with various predefined-value", () => {
    const aditya = jkt`
      name: ${'Aditya'}
      age: ${25}
      birthday: ${new Date()}
      money: ${324432.23}
      cards: ${['somecard', 'credit card', 'debit card']}
      object: ${{name: 'dummy', example: 'just example'}}
      nullval: ${null}
      introvert: ${true}
      ability: ${say => `hello ${say}`}
      symbol: ${Symbol('something')}
    `;
  })
  it("should be able to create struct with enum", () => {
    const hobby = jkt.ENUM`
      biking
      swimming
      running
      something: Interesting
      some: ${"Value Here"}
    `;
    const person = jkt`
      hobby: ${hobby}
    `;

    const person2 = jkt`
      hobby: ${jkt.ENUM("biking, swimming: Berenang")}
    `;

    expect(person.E.HOBBY).to.deep.equal({
      BIKING: "BIKING",
      SWIMMING: "SWIMMING",
      RUNNING: "RUNNING",
      SOMETHING: "Interesting",
      SOME: "Value Here"
    });
    expect(person2.E.HOBBY).to.deep.equal({
      BIKING: "BIKING",
      SWIMMING: "Berenang"
    });
  });
  it("should be able to parse value without enum included", () => {
    const Colors = jkt.ENUM`white, blue, green, orange`;
    const Hobbies = jkt.ENUM`
      Hiking
      Biking
      Swimming
    `;

    const person = jkt`
      name: String,
      age: Number
      hobby: ${Hobbies}
    `;

    const aditya = person({
      name: "Aditya kresna",
      age: "26",
      hobby: "SWIMMING"
    });

    const amelia = person({
      name: "Amelia Zahra",
      age: "25",
      hobby: "hiking"
    });

    expect(aditya.j()).to.deep.equal({
      name: "Aditya kresna",
      age: 26,
      hobby: "SWIMMING"
    });
    expect(amelia.j()).to.deep.equal({
      name: "Amelia Zahra",
      age: 25,
      hobby: null
    });
  });
  it("should trigger error when using reserved words", () => {
    const reservedJObj = () => {
      const person = jkt`
        name: String
        j: Object
      `;
    };

    const reservedToJSONObj = () => {
      const person = jkt`
        name: String
        toJSON: Object
      `;
    };

    const reservedGetSchema = () => {
      const person = jkt`
        name: String
        getSchema: Object
      `;
    };

    const reservedGetDirtySchema = () => {
      const person = jkt`
        name: String
        getDirtySchema: Object
      `;
    };

    const reservedInstanceOf = () => {
      const person = jkt`
        name: String
        instanceOf: Object
      `;
    };

    const reservedToString = () => {
      const person = jkt`
        name: String
        toJSON: Object
      `;
    };

    const errorThrown = `Any properties and methods with name ${reservedKeys.RESERVED_KEYS.join(
      ", "
    )} are reserved`;

    expect(reservedJObj).to.throw(Error, errorThrown);
    expect(reservedToJSONObj).to.throw(Error, errorThrown);
    expect(reservedToString).to.throw(Error, errorThrown);
    expect(reservedGetSchema).to.throw(Error, errorThrown);
    expect(reservedGetDirtySchema).to.throw(Error, errorThrown);
    expect(reservedInstanceOf).to.throw(Error, errorThrown);
  });
  it("should have built-in properties for default jkt object", () => {
    const person = jkt`
      name: String
      age: Number
      birth: Date
    `;

    const child = person({
      name: "Aditya",
      age: 14,
      birth: "1991-06-33"
    });

    (typeof person).should.equals("function");
    person.should.haveOwnProperty("isJKT");
    person.should.haveOwnProperty("schema");
    person.should.haveOwnProperty("childOf");
    (typeof person.childOf).should.equals("function");
    person.should.haveOwnProperty("__id");
    person.should.haveOwnProperty("__schema");

    child.should.haveOwnProperty("name");
    child.should.haveOwnProperty("age");
    child.should.haveOwnProperty("birth");
    child.should.haveOwnProperty("j");
    (typeof child.j).should.equals("function");
    child.should.haveOwnProperty("getSchema");
    (typeof child.getSchema).should.equals("function");
    child.should.haveOwnProperty("getDirtySchema");
    (typeof child.getDirtySchema).should.equals("function");
    child.should.haveOwnProperty("toJSON");
    (typeof child.toJSON).should.equals("function");
    child.should.haveOwnProperty("toString");
    (typeof child.toString).should.equals("function");
    child.should.haveOwnProperty("instanceOf");
    (typeof child.instanceOf).should.equals("function");
  });
  it("should have built-in properties for enum object", () => {
    const Colors = jkt.ENUM`Red, green, blue`;

    (typeof Colors).should.equals("function");
    Colors.should.haveOwnProperty("isJKTENUM");
    Colors.should.haveOwnProperty("j");
    (typeof Colors.j).should.equals("function");
    Colors.should.haveOwnProperty("toJSON");
    (typeof Colors.toJSON).should.equals("function");
  });
  it("should be able to parse in-listed values", () => {
    const stringParse = jkt`name: String`({ name: "Aditya kresna Permana" });
    const numberParse = jkt`age: Number`({ age: "26" });
    const dateParse = jkt`birth: Date`({ birth: "1991-06-18" });
    const boolParse = jkt`isMarried: Boolean`({ isMarried: true });
    const objectParse = jkt`basket: Object`({
      basket: { fruits: ["banana", "orange", "apple"] }
    });
    const functionParse = jkt`showColor: Function`({
      showColor: color => `this is ${color}`
    });
    const arrayParse = jkt`hobbies: Array`({
      hobbies: ["fishing", "running", "climbing"]
    });

    (typeof stringParse.name).should.equals("string");
    expect(stringParse.name).to.be.equal("Aditya kresna Permana");

    (typeof numberParse.age).should.equals("number");
    expect(numberParse.age).to.be.equal(26);

    expect(moment.isMoment(dateParse.birth)).to.be.true;
    expect(dateParse.birth.format("DD-MM-YYYY")).to.be.equal("18-06-1991");

    (typeof boolParse.isMarried).should.equals("boolean");
    expect(boolParse.isMarried).to.be.true;

    (typeof objectParse.basket).should.equals("object");
    expect(objectParse.basket).to.deep.equal({
      fruits: ["banana", "orange", "apple"]
    });

    (typeof functionParse.showColor).should.equals("function");
    expect(functionParse.showColor("blue")).to.be.equal("this is blue");

    expect(arrayParse.hobbies).to.be.an.instanceOf(Array);
    expect(arrayParse.hobbies).to.have.ordered.members([
      "fishing",
      "running",
      "climbing"
    ]);
  });
  it("should thrown error when parse non in-listed values", () => {
    const wrongParse = () => {
      jkt`name: Stringsss`({});
    };

    const stringParse = () => {
      jkt`name: String `({});
    };

    const numberParse = () => {
      jkt`age: Number `({});
    };

    const dateParse = () => {
      jkt`birth: Date `({});
    };

    const boolParse = () => {
      jkt`isMarried: Boolean `({});
    };

    const arrayParse = () => {
      jkt`hobbies: Array `({});
    };

    const objectParse = () => {
      jkt`skils: Object `({});
    };

    const functionParse = () => {
      jkt`sayHello: Function `({});
    };

    const anyParse = () => {
      jkt`uniqueValue: Any `({});
    };

    expect(wrongParse).to.throw(TypeError, "Unknown type was given");
    expect(stringParse).to.not.throw();
    expect(numberParse).to.not.throw();
    expect(dateParse).to.not.throw();
    expect(boolParse).to.not.throw();
    expect(arrayParse).to.not.throw();
    expect(objectParse).to.not.throw();
    expect(functionParse).to.not.throw();
    expect(anyParse).to.not.throw();
  });
  it("should be able to use translator object", () => {
    const Person = jkt`
      name: String
      age: Number
      birthday: ${jkt.trans.custom(value => "SOme date")}
    `;

    const nina = Person({
      name: "Nina",
      age: "25",
      birthday: new Date()
    });

    expect(nina.j()).to.deep.equals({
      name: "Nina",
      age: 25,
      birthday: "SOme date"
    });

    expect(nina.name).to.equal("Nina");
    expect(nina.age).to.equal(25);
    expect(nina.birthday).to.equal("SOme date");
  });
  it("should be able use mapping key which coming from another supplied key", () => {
    const Person = jkt`
      name: String
      age: Number
      birthday: DatePlain
      birthday->happyDay: DatePlain
    `;

    const RandomObject = jkt`
      name->someName: String
      age->someAge: Number
      age->myAge: String
      birthday->bornDay: DatePlain
    `;

    const nina = Person({
      name: "Nina",
      age: "25",
      birthday: "1991-06-18"
    });

    const randObj = RandomObject({
      name: "Nikola Tesla",
      age: "27",
      birthday: "1991-06-18"
    });

    expect(nina.j()).to.deep.equals({
      name: "Nina",
      age: 25,
      birthday: "1991-06-18T00:00:00.000Z",
      happyDay: "1991-06-18T00:00:00.000Z"
    });

    expect(randObj.j()).to.deep.equals({
      someName: "Nikola Tesla",
      someAge: 27,
      myAge: "27",
      bornDay: "1991-06-18T00:00:00.000Z"
    });

    expect(nina.name).to.equal("Nina");
    expect(nina.age).to.equal(25);
    expect(nina.birthday.toJSON()).to.equal("1991-06-18T00:00:00.000Z");
    expect(nina.happyDay.toJSON()).to.equal("1991-06-18T00:00:00.000Z");

    expect(randObj.someName).to.equal("Nikola Tesla");
    expect(randObj.someAge).to.equal(27);
    expect(randObj.myAge).to.equal("27");
    expect(randObj.bornDay.toJSON()).to.equal("1991-06-18T00:00:00.000Z");
  });
  it("should not produced deleted key on serialize", () => {
    const Person = jkt`
      name: String
      age: Number
      birthday: DatePlain
      Hobby: String
      Address: String
    `;

    const Animal = Person`
      Address->cage: String
      Hobby: !DELETE
      Address: !DELETE
    `

    const Bird = Animal({
      name: 'Birdie',
      age: '1',
      birthday: '2018-03-08',
      Hobby: 'Flying',
      Address: 'Jakarta'
    })

    expect(Bird.j()).to.deep.equals({
      name: 'Birdie',
      age: 1,
      birthday: '2018-03-08T00:00:00.000Z',
      cage: 'Jakarta'
    });
  });
});
