<img src="https://raw.github.com/slaveofcode/jkt/master/logos/jkt400.png" align="right" />

# JKT Parser

Simple helper to parse your JSON.

<!-- TOC -->

* [JKT Parser](#jkt-parser)
  * [Background](#background)
    * [Requirements](#requirements)
    * [Installing](#installing)
  * [Running the tests](#running-the-tests)
  * [API References](#api-references)
    * [Struct](#struct)
    * [Available Types](#available-types)
    * [Instance of Struct](#instance-of-struct)
    * [One Line vs Multi Line](#one-line-vs-multi-line)
    * [Custom Predefined Value](#custom-predefined-value)
    * [Extending Struct](#extending-struct)
    * [Removing Parent Property](#removing-parent-property)
    * [Check The Instance and Child](#check-the-instance-and-child)
    * [Strict Types](#strict-types)
    * [ENUM Value](#enum-value)
    * [Nested Struct](#nested-struct)
    * [Array Container](#array-container)
    * [Custom Value Translator](#custom-value-translator)
    * [Arrow Mapping Key -> Values](#arrow-mapping-key---values)
    * [Struct & Instance References](#struct--instance-references)
    * [Struct Property & Function](#struct-property--function)
    * [Instance Function](#instance-function)
  * [Author](#author)
  * [License](#license)
  * [Acknowledgments](#acknowledgments)

<!-- /TOC -->

## Background

At the first time I wonder how could I make my JSON to be more manageable. So confusing when every time I checking up the right parameters to my function, make sure the produced JSON data are valid and parsing all over the JSON properties to follow my rules (types).

Then I do research and no one module is available to fit in with my case, so I built this one.

**JKT** is a simple **Javascript** module to create a structure for your JSON. It's basically just a simple parser to handle property types, the structure and provide a small helper to handle the data.

### Requirements

To use JKT you need a NodeJS version `6.4.0` and up. Basically JKT really depends on ES6 style which using template literal in practice.

```
const jkt = require('jkt') // CommonJs

const Person = jkt`
  name: String
  age: Number
  birthday: Date
  hobbies: Array
`
```

### Installing

As described before, you need NodeJs with version `6.4.0` and up before using this module. After that installing JKT is just simply as.

> Using NPM

```
npm i jkt --save
```

> Using Yarn

```
yarn add jkt
```

When finished you'll notice that this modules requires some libraries like `lodash`, `moment` and `shortid`.

## Running the tests

The test is very very simple, you just have to clone the project, do `npm install` and run `npm run test`, nothing special.

## API References

### Struct

You just have to define the JKT struct once and then you could rely on them. The struct is defined by using template literal.

```
const Person = jkt`
  name: String
  age: Number
  birthday: Date
  Hobbies: Array
`
```

### Available Types

| Type         | Description                                                                                                                                      | Show on Invalid? | Show on JSON result |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------------- |
| `String`     | String type value                                                                                                                                | Yes              | Yes                 |
| `String!`    | Force to only accept string value                                                                                                                | No               | No                  |
| `Number`     | Numeric type value, works for either Integer or Float                                                                                            | Yes              | Yes                 |
| `Number!`    | Force to only accept numeric value                                                                                                               | No               | No                  |
| `Boolean`    | Boolean type value, works for either Integer or Float                                                                                            | Yes              | Yes                 |
| `Boolean!`   | Force to only accept boolean value                                                                                                               | No               | No                  |
| `Date`       | Date type value that accept `ISO 8601`, supported by `Moment` and it is timezone aware (will convert to UTC time) based on your machine timezone | Yes              | Yes                 |
| `Date!`      | Force to only accept valid date value and will produce timezone aware date                                                                       | No               | No                  |
| `DatePlain`  | Date type value that accept `ISO 8601`, supported by `Moment` and it is not timezone aware                                                       | Yes              | Yes                 |
| `DatePlain!` | Force to only accept valid date value and will not produce timezone aware date                                                                   | No               | No                  |
| `Array`      | Array type value                                                                                                                                 | Yes              | Yes                 |
| `Array!`     | Force to only accept array value                                                                                                                 | No               | No                  |
| `Object`     | Object type value                                                                                                                                | Yes              | Yes                 |
| `Object!`    | Force to only accept object value                                                                                                                | No               | No                  |
| `Function`   | Function type value                                                                                                                              | No               | No                  |
| `Function!`  | Force to only accept function                                                                                                                    | No               | No                  |
| `ANY`        | Any type value will be valid                                                                                                                     | Yes              | Yes                 |

### Instance of Struct

You can assume the `Person` as a structure for json data, then every time you do parsing, you just have to pass an argument into `Person`.

```
const aditya = Person({
  name: "Aditya Kresna",
  age: '26',
  birthday: '1991-06-18' // ISO 8601
})

// now aditya is the instance of Person
```

Then you could use `aditya` properties or produce valid JSON format from it

```
aditya.name // "Aditya Kresna"
aditya.birthday // moment time
aditya.toJSON() // produce valid json format
aditya.j() // the shorthand method
```

One thing that you should know is if JKT fails to identify type of the value, it will returning `null` as a default, except you use **force** type like `String!` and `Number!`

**[> See the result on RunKit](https://runkit.com/zeandcode/jkt-basic)**

### One Line vs Multi Line

There is a few method you can follow while making a struct, **One Line** and **Multi Line**. If you think your struct object is short and don't wanna make more space with using multi lines, you could simply create a struct separated by comma `,`.

```
const Animal = jkt`type: String, color: String, isWild: Boolean`
```

or by multiple lines like this

```
const Animal = jkt`
  type: String
  color: String
  isWild: Boolean
`

const Animal2 = jkt`
  type: String,
  color: String,
  beast: Boolean
`

const Animal3 = jkt`
  type: String!,
  color: String!,
  beast: Boolean
`
```

**[> See the result on RunKit](https://runkit.com/zeandcode/jkt-one-line-vs-multi-line)**

### Custom Predefined Value

When you need to setup custom value upfront, without checking it's type or doing some validations, You could use it as a predefined value by put them inside of expression `${}`. Predefined value is the value you define when defining the struct.

```
const Mother = jkt`
  name: String
  birthday: Date
  haveChild: ${true}
`

const angela = Mother({
  name: "Angela",
  Birthday: "1990-06-06"
})

const christy = Mother({
  name: "Angela",
  Birthday: "1990-06-06",
  haveChild: false
})

const Person = jkt`
  name: String
  sayTheWords: ${(words) => `Hi, ${words}`},
  someOptions: ${{some: "options"}}
`

const aditya = Person({
  name: "Aditya"
})

angela.haveChild // true
christy.haveChild // false

aditya.sayTheWords('How are you') // "Hi, How are you"

aditya.j()
// { name: "Aditya", someOptions: { some: "options" } }
```

**[> See the result on RunKit](https://runkit.com/zeandcode/custom-predefined-value)**

You could pass anything you want, but if you pass a `function` for example, it will not showing on the output when you calling `toJSON` or `j` function, because the value wasn't a valid JSON type.

### Extending Struct

Once you define a struct it possible to extend into another struct.

```
const Person = jkt`
  name: String
  age: Number
  hobby: Array
  birthday: Date
`

const Driver = Person`
  useBike: Boolean
  useCar: Boolean
`

const Doctor = Person`
  specialist: String
  hospitalLocation: String
`
```

**[> See the result on RunKit](https://runkit.com/zeandcode/extending-struct)**

Both of `Driver` and `Doctor` is a child of `Person`, so you will get the `name`, `age`, `hobby` and `birthday` properties when you do parse of the `driver` and `doctor` instance.

### Removing Parent Property

Sometimes we want to extend from existing struct but on a few situation we don't wanna include some properties. By using `!DELETE` we can exclude the property when extending from existing struct.

```
const Person = jkt`
  name: String
  age: Number
  hobby: Array
  drinkBeer: Boolean
`

const Child = Person`
  toys: Array
  drinkBeer: !DELETE   // this "drinkBeer" will be deleted on child struct
`
```

**[> See the result on RunKit](https://runkit.com/zeandcode/removing-parent-property)**

### Check The Instance and Child

It is also possible to checking the instance and child.

```
const Person = jkt`
  name: String
  age: Number
  hobby: Array
`
const Child = Person`
  toys: Array
  doingHomework: Boolean
`

const Mother = Person`
  singleParent: Boolean
`

const John = Child({
  name: "John Doe"
})

Child.childOf(Person) // true
Mother.childOf(Person) // true

John.instanceOf(Person) // true
John.instanceOf(Child) // true
```

**[> See the result on RunKit](https://runkit.com/zeandcode/check-the-instance-and-child)**

### Strict Types

As mentioned before (on a table), every unsupplied value or invalid type would make the property have `null` value when parsed. But we can force the property to not exist when invalid value raised.

```
const Person = jkt`
  name: String
  age: Number!
  hobby: Array!
`

const John = Person({ name: "John Doe", age: "not sure"})

John.j() // { name: "John Doe" }
```

**[> See the result on RunKit](https://runkit.com/zeandcode/strict-types)**

### ENUM Value

We often need to reference some value based on it's own defined types. This could be done with `ENUM`, where ENUM is a feature when we need some property to strictly follow the type as we defined on ENUM itself.

```
const Colors = jkt.ENUM`
  RED: Maroon
  WHITE
  BLUE: ${'just blue'}
`

const TSize = jkt.ENUM`small, medium, large, extra_large: ${'EXTRA-LARGE'}`

const TShirt = jkt`
  model: String
  brand: Number!
  color: ${Colors}
  size: ${TSize}
`

// Calling enum directly
Colors() // { RED: 'Maroon', WHITE: 'WHITE', BLUE: 'just blue' }

TSize() // { SMALL: 'SMALL', MEDIUM: 'MEDIUM', LARGE: 'LARGE', EXTRA_LARGE: 'EXTRA-LARGE' }


// Callling enum from struct using "E" property
TShirt.E.COLOR.RED // "Maroon"
```

**[> See the result on RunKit](https://runkit.com/zeandcode/enum-value)**

The `E` stands for the collection of the ENUM on `TShirt`. If you want to see complete values of ENUM just take the `E` property.

All enum properties and value would be converted to **Upper-Case** string (even if it's a number), it doesn't accept any special characters except underscore `_` and If you want to set custom value just use an expression `${}`.

### Nested Struct

Every single struct we define is an independent structure that could be used with another struct. By this point you got a very reusable component as you may need the same structure on another struct (eg. as a collection).

```
const Person = jkt`
  name: String
  age: Number
  birthday: Date
`

const SchoolClass = jkt`
  name: String
  grade: Number
  teacher: ${Person}
`

// show the schema
SchoolClass.schema

/**
{
  name: "String",
  grade: "Number",
  teacher: {
    name: "String",
    age: "Number",
    birthday: "Date"
  }
}
*/

const mySchoolClass = SchoolClass({
  name: 'Awesome Class',
  grade: '10',
  teacher: {
    name: 'Amelia',
    age: 25,
    birthday: '1992-05-31' // ISO 8601
  }
})

mySchoolClass.j()
/**
{ name: "Awesome Class",
  grade: 10,
  teacher: {
    name: "Amelia",
    age: 25,
    birthday: "1992-05-30T17:00:00.000Z"
  }
}
*/
```

**[> See the result on RunKit](https://runkit.com/zeandcode/nested-struct)**

### Array Container

Container to keep our struct inside json array.

```
const Person = jkt`
  name: String
  age: Number
  birthday: Date
`

const SchoolClass = jkt`
  name: String
  grade: Number
  students: ${jkt.c.arr(Person)}
`
```

**[> See the result on RunKit](https://runkit.com/zeandcode/array-container)**

### Custom Value Translator

With all of provided parsers, I believe there is always not enough to cover up our desired types. So here's translator comes in.

```
const Person = jkt`
  name: String
  age: Number
  birthday: ${jkt.trans.custom(val => "I'm old man =,=")}
`

const nina = Person({
  name: "Nina",
  age: "25",
  birthday: new Date() // this will produce "I'm old man =,="
});

nina.birthday // "I'm old man =,="
nina.j().birthday // "I'm old man =,="
```

**[> See the result on RunKit](https://runkit.com/zeandcode/translator-custom-value)**

### Arrow Mapping Key -> Values

With mapping you could reuse key-value on supplied json to make your own custom key based on that source.

```
const Person = jkt`
  name: String
  name->full_name: String // mapping from source key (name) to new key (full_name)
  address: String
  address->address2: String // mapping from source key (address) to new key (address2)
  age: Number
  age->ageInString: String // mapping from source key (age) to new key (ageInString) with type String
`

const aditya = Person({
  name: "Aditya",
  age: "27",
  address: "Kota Bekasi"
});

aditya.name // "Aditya"
aditya.full_name // "Aditya"
aditya.address2 // "Kota Bekasi"
aditya.age // 27
aditya.ageInString // "27"
```

**[> See the result on RunKit](https://runkit.com/zeandcode/arrow-mapping)**

### Struct & Instance References

These are detailed function & properties you could use when using jkt struct. You shouldn't use the following reserved words as a property for your struct, because it was reserved to support the module.

### Struct Property & Function

| Name       | Type           | Description                                                                                                            |
| ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `isJKT`    | Boolean (true) | Nothing special about this, just used to to identify JKT struct on internal parser.                                    |
| `schema`   | JSON           | Schema of struct, you could inspect this property after defining the struct.                                           |
| `childOf`  | Function       | To check if the struct is a child of the given struct                                                                  |
| `__id`     | String         | The id of struct, every struct has an unique id generated based on `shortid` library                                   |
| `__schema` | JSON           | The dirty schema of the struct which used internally to parse value                                                    |
| `E`        | JSON           | A container of all enum values on the struct, this property only available when we set some property with `ENUM` type. |

### Instance Function

| Name             | Description                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `instanceOf`     | To identify the instance of struct                                                                                              |
| `getSchema`      | To get struct schema from the instance                                                                                          |
| `getDirtySchema` | To get the real struct schema from the instance. The result including the function and properties to do parse inside the module |
| `toJSON`         | To get valid json from the instance.                                                                                            |
| `j`              | To get valid json from the instance. This is a shorthand method of `toJSON`                                                     |
| `toString`       | To get json string from the instance.                                                                                           |

## Author

* **Aditya Kresna Permana** - _Indonesia_ - [SlaveOfCode](https://github.com/slaveofcode)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* This module may have some limitation based on reserved naming of the methods and properties
* Highly inspired with styled-components style
* This module may still buggy, make a pull request or make an issue if you found them.
