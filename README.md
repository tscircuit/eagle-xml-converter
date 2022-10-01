# Eagle XML to JSON Converter

Converts Eagle XML files ([example input](./tests/attiny/attiny.xml)) to JSON ([example output](./example-output.json)).

## Usage

`yarn add @tscircuit/eagle-xml-convert`

```ts
import fs from "fs"
const file = await fs.promises.readFile("tests/attiny/attiny.xml")

const eagleJSON = parseEagleXML(file.toString())

console.dir(eagleJSON, { depth: null })
/*
{
  version: '7.1.0',
  settings: { alwaysvectorfont: 'no', verticaltext: 'up' },
  grid: {
    distance: 0.1,
    unitdist: 'inch',
    unit: 'inch',
    style: 'lines',
    multiple: 1,
    display: 'no',
    altdistance: 0.01,
    altunitdist: 'inch',
    altunit: 'inch'
  },
  library: {
    packages: [
      {
        circle: {
          x: -4.44,
          y: 4.4,
          radius: 0.1,
          width: 0.2,
          layer: 21
        },
        wire: [
          {
            x1: -1.9475,
            y1: 4.425,
            x2: 1.9475,
            y2: 4.425,
            width: 0.127,
            layer: 21
          },
...
*/
```
