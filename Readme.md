# Text Marker
Text Marker is a lexical analysis library for idenifying regions of text according to the custom rules supplied.  It accepts a string and array of rules as input and produces an array of tokens for output.

## Use Cases
Text Marker is flexible enough to allow you to use it to:
- Identify links
- Highlight words
- Define a simple markup language. 

Since the library only returns regular javascript objects it is not tied to a specific rendering framework. While this introduces a requirement to implement your own view component to render the tokens, it leaves the library flexible enough so that you can apply the same rules to parsing text when you eventually need to swap out your view library or have to operate in a mixed environment that uses multiple rendering frameworks

## Basic usage
Text Marker exposes an object with methods that provides basic functionality. See below for details

### textMarker.parse
Accepts accepts a string and arrays of rules and middleware and returns an array of tokens.
````javascript
  let tokens = textMarker.parse('I have a *block* token', [rules], [middleware]);
````


### textMarker.block
Blocks are visible characters that should be REPLACED by tokens. It accepts an object with open and close string properties and a name for the token. If a close property is not provided it will default to the same value as the open property. By default blocks will only detect a match if it finds both and opening AND matching closing string. Blocks are case insensitive.

````javascript
let openAndCloseTags = {open: '*', close: '*'};
let name = 'MyBlock';
let blockRule = textMarker.block(openAndCloseTags, name);
let tokens = textMarker.parse('I have a *block* token', [blockRule]);
````

Since blocks will only detect a match if it finds both and opening AND matching closing string, in the example below no block tokens will be found.

````javascript
let openAndCloseTags = {open: '*', close: '*'};
let name = 'MyBlock';
let blockRule = textMarker.block(openAndCloseTags, name);
let tokens = textMarker.parse('I have a * no block tokens', [blockRule]);
````

The block function can also accept a regular expression, instead of a string as it's first argument. When providing your own regular expression please note:
- Blocks are pairs and the pattern is expected to match the beginning and end tokens as a group
- The regular expression MUST wrap the open match as the first group and close match as the second group
- An unoptimized regular expression MAY have adverse performance affects based on the size of the text being parsed and how greedy the regular expression match is


#### Reserved Blocks
When giving your block a name please note that "TABLE", "TABLE_ROW" and "TABLE_CELL" have a special meaning. See [Nesting in Tables](#nesting-in-tables)

### textMarker.range
Ranges are patterns of text that need to be wrapped by tokens. For example if you want to define a word to be highlighted. Ranges are case insensitive.

````javascript
let name = 'MyHighlight';
let rangeRule = textMarker.range('foo', name);
let tokens = textMarker.parse('I have foo range tokens', [rangeRule]);
````

The range function can also accept a regular expression, instead of a string as it's first argument.

### textMarker.keyword
Keywords are special characters that will be replaced by a token. This can be useful if you want to replace certain words with other forms of output (images, etc.) or trigger other effects.

````javascript
let name = 'MyImageSwap';
let keywordRule = textMarker.keyword('foo', name);
let tokens = textMarker.parse('I have a foo keyword token', [keywordRule]);
````

###  textMarker.tokensToString
Utility function that outputs your tokens as a string.

## Overlapping blocks and ranges
Text Marker will also ensure the generated tokens are properly nested and do not overlap with each other. If it does detect overlapping blocks or ranges of text it will attempt insert tokens that create a valid tree. It makes it easier to work with libraries like React that require a component to be valid html. The inserted tokens created to correct the tree have a _virtual property set to true.

Basically it will provide an array of tokens to help prevent you from rendering this
````
<b>foo <u>bar</b> baz</u>
````
and instead help you render this
````
<b>foo <u>bar</u></b><u> baz</u>
````

### Nesting in Tables
If a block or range span is not closed when an end of a TABLE_CELL (token.name === 'TABLE_CELL') is parsed it will automatically be closed and not continued.

## Modules
Text Marker supports CommonJS, AMD and good old fashioned script tags. 

## Middleware
Middleware is an array of functions applied prior to searching for any tokens. Each middleware function will receive a text string as an argument and is expected to return a text string. The test provided in the argument may be the original text supplied or the output of the middleware that executed earlier.

If any middleware throws and error Text Marker will stop executing all middleware and apply the provided token rules using the **original** text supplied to the parse function.

