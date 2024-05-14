# Character Code Ciphers
This library supports creating your own text ciphers based on the UTF-16 character codes for said text.  This is also meant to be easily extendable so you can add your own cipher types and key generation classes.

This currently comes with support for autokey, caesar, columnar, Vigenère, and xor ciphers right out of the box.

# Quickstart
## Installation
You can install this library through npm like so:
```
$ npm install --save character-code-ciphers
```

## Character Code Ciphers
You'll usually want to use the `CharacterCodeCipher` class to generate most of your ciphers.  This does the legwork of breaking text down into a character code sequence for you.  That sequence is then passed into a dedicated encoder for those code values.

You can set the encoder by passing it in as the first parameter, like so:
```
const cipher = new CharacterCodeCipher(
  new BackwardsCipher()
)
```

## Substitution Ciphers
### Caesar Cipher
The `CaesarCipher` class tries to shift each of the provided character codes up or down by a certain amount.  Each such cipher takes in the following parameters:
 * codeRanges - defines ranges of character codes that make up the cipher's alphabet
 * shiftRule - generates the shift for a given position within the character code array

How that works is any character within one of the provided range will have the target shift applied to.  If that shift would force it past the range's limits it will be wrapped to said limits.  For examples, a value 1 point over the maximum would change to the range's minimum.

We've provided `getFullCharacterCodeRange` and `parseCharacterCodeRanges` functions to help generate those code ranges.

`getFullCharacterCodeRange` generates a range that covers all valid character codes.  Using this has the upside of incorporating unusual characters, making them harder to decipher at a glance.  As it covers every character it should be used on it's own rather than combined with other ranges.

`parseCharacterCodeRanges` breaks the provided string into character pairs and treats the codes of each such pair as the limits of a character code range.  For examples, `parseCharacterCodeRanges('azAZ')` would give 2 ranges: 97 - 122 (a - z) and 65 - 90 (A - Z).

Shift rules can be as simple as providing a number.  For example, to get a ROT-13 cipher simply combine the above range with shift of 13, like so:
```
const latinRanges = parseCharacterCodeRanges('azAZ')
const cipher = new CharacterCodeCipher(
  new CaesarCipher(latinRanges, 13)
)
```

Doing so will wrap the number in a `FixedResponseEvaluator` that always returns that value.

For more complex ciphers, consider using one of the following evaluators instead.

### Autokeys
The `AutokeyFactory` class will generate keys based on prior decoded values.  It takes in the following parameters:
 * padding - Initial keys to be used.  You'll want at least 1 value here so it know how to operate before any values are decoded.
 * useOffsets - Turn this on if you want to use each code's position within it's associated range for the shift.  Otherwise the character code itself will be treated as the shift.

The factory will run through all it's padding keys before it starts reading through the source's decoded values.

### Cyclic Keys
A `CyclicEncodingKey` will loop through the set of provided shift, starting with the first value and returning to it after the last value has been used.  Said array of values is the instance's only constructor parameter.

Should you want to generate those shifts from a password or similar text, you can use the `stringToCharacterOffsets` function.  That takes the target text as it's first parameter and the character for offset 0 as it's second parameter.

### Progressive Keys
A `ProgressiveEncodingKey` simply multiplies the target index by it's rate to get the shift.  For examples, at a rate of 2 you'd double the index to get the shift.  Said rate is the constructor's sole parameter and defaults to 1.  Note that the shift is limited to safe integers and will wrap around into a negative value should the product get too large.

### Summed Keys
The `SumEvaluator` adds together the results of it's child evaluators.  This lets you combine the other key generation methods, such as having a progressive cyclic key.  As with progressive keys, these are capped at safe integers and will wrap into negatives as needed.

### Xor Cipher
The `XorCipher` class will flip specific bits of the target character code, as specified by the current key.  That key is provided by the instance's key rule evaluator, which can be passed into the constructor.

This is much like a caesar cipher's shift rules in that it can be a number or a numeric array evaluator.  That allows for progressive, cyclic, and summed keys.  However, it does not accept autokeys at present as those rely on a range being associated with the number, which xor ciphers don't assign.

## Transposition Ciphers
### Backwards Cipher
The `BackwardsCipher` class simply reverses the order of the provided character codes, allowing for backwards writing.  It's mostly a fun little extra as it's so easy to decode, but may be useful combined with other ciphers.

### Columnar Cipher
Columnar ciphers work by splitting character codes evenly over fixed number of columns, effectively creating a character grid.  After any transformations are applied to that grid the contents of each colum and then splice together.

For example, let's say you wanted to encode "rowboat" to a 3 column cipher.  That would be written like this:
```
row
boa
t
```

That gives you "rbt", "oo", and "wa" as columns, meaning you'd get "rbtoowa" as the encoded string if no other changes were applied to grid before reading it.

As you might expect, we use the `ColumnarCipher` class to handle these.  Said class takes either a column count or an array of column definitions as it's sole constructor parameter.

If a column count is provided, this operates as above with no additional changes before splicing together the columns.

Column definitions may have `index` and `encoder` properties.  You may simply provide a number as the column definition in the constructor.  If you do so, that number will be treated as the column's index.

The cipher will sort columns in ascending index order, using the actual array index if no index property has been set for the column.  This effectively means you can use the index property to tell the cipher what order the column should be put in when encoded.

In contrast, the encoder property lets you specify a character code encoder to be applied to all codes in the column.  This lets you do things like apply a caesar cipher to specific columns with then cipher.

## Layered Ciphers
Should you want to combine character code ciphers, you can do so through the `LayeredDataEncoder` class.  Simply pass an array of ciphers into it's constructor.  During encoding it will perform those ciphers in order, passing the results of the previous encoding into the next cipher.
