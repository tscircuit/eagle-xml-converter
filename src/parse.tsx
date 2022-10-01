import { XMLParser } from "fast-xml-parser"
import { RequireExactlyOne } from "type-fest"

export interface Settings {
  alwaysvectorfont?: "no" | "yes"
  verticaltext?: "up"
}

export type S1Setting = RequireExactlyOne<Settings>

export interface Grid {
  distance: "0.1"
  unitdist: "inch"
  unit: "inch"
  style: "lines"
  multiple: "1"
  display: "no"
  altdistance: "0.01"
  altunitdist: "inch"
  altunit: "inch"
}

export interface DrawGroup {
  name: string
  circle?: Array<{
    x: string
    y: string
    radius: string
    width: string
    layer: string
  }>
  rectangle?: Array<{
    x1: string
    y1: string
    x2: string
    y2: string
    layer: string
  }>
  text?: Array<{
    "#text": string
    x: string
    y: string
    size: string
    layer: string
    align: "top-left"
  }>
  wire?: Array<{
    x1: string
    y1: string
    x2: string
    y2: string
    width: string
    layer: string
  }>
  smd?: Array<{
    name: string
    x: string
    y: string
    dx: string
    dy: string
    layer: string
    roundness: string
  }>
}

export interface Package extends DrawGroup {}

export interface Symbol extends DrawGroup {
  pin: Array<{
    name: string
    x: string
    y: string
    length: "middle"
    direction?: "pwr"
    rot?: "R180"
  }>
}

export interface Gate {
  name: string
  symbol: string
  x: number
  y: number
}

export interface Connect {
  gate: string
  pin: string
  pad: string
}

export interface Device {
  connects: Array<Connect>
  name: string
  package: string
}

export interface RawDevice {
  connects: { connect: Array<Connect> }
  name: string
  package: string
}

export interface RawDeviceSet {
  description: string
  gates: { gate: Array<Gate> }
  devices: { device: Array<RawDevice> }
  name: string
  prefix: string
}

export interface DeviceSet {
  description: string
  gates: Array<Gate>
  devices: Array<Device>
  name: string
  prefix: string
}

export interface RawEagleJSON {
  version: string
  settings: {
    setting: Array<RequireExactlyOne<Settings>>
  }
  grid: Grid
  layers: { layer: Array<Layer> }
  library: {
    packages: {
      package: Array<Package>
    }
    symbols: { symbol: Array<Symbol> }
    devicesets: { deviceset: Array<RawDeviceSet> }
  }
}

export interface Layer {
  number: string
  name: string
  color: string
  fill: string
  visible: "yes" | "no"
  active: "yes" | "no"
}

export interface EagleJSON {
  version: string
  settings: Settings
  grid: Grid
  layers: Array<Layer>
  library: {
    packages: Package[]
    symbols: Symbol[]
    devicesets: DeviceSet[]
  }
}

const makeArray = (v: any) => (!v ? [] : Array.isArray(v) ? v : [v])

export const parseEagleXML = (eagleXML: string): EagleJSON => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "",
    parseAttributeValue: true,
    isArray(tagName, jPath, isLeafNode, isAttribute) {
      if (tagName === "drawing") return false
      if (tagName === "eagle") return false
      if (tagName === "library") return false
      if (tagName === "packages") return false
      if (tagName === "symbols") return false
      if (tagName === "layers") return false
      if (tagName === "devicesets") return false
      if (tagName === "settings") return false
      if (tagName === "devices") return false
      if (tagName === "connects") return false
      if (tagName === "gates") return false
      if (isAttribute) return false
      if (isLeafNode) return false
      return true
    },
  })
  const parsedXML = parser.parse(eagleXML)
  const raw: RawEagleJSON = {
    ...parsedXML.eagle.drawing,
    version: parsedXML.eagle.version,
  }

  return {
    version: raw.version,
    settings: raw.settings.setting.reduce((agg: any, setting) => {
      return { ...agg, ...setting }
    }) as any,
    grid: raw.grid,
    layers: raw.layers.layer,
    library: {
      packages: raw.library.packages.package,
      devicesets: raw.library.devicesets.deviceset.map(
        (rawDS: RawDeviceSet): DeviceSet => {
          return {
            ...rawDS,
            gates: makeArray(rawDS.gates.gate),
            devices: rawDS.devices.device.map(
              (rawDevice: RawDevice): Device => {
                return {
                  ...rawDevice,
                  connects: rawDevice.connects.connect,
                }
              }
            ),
          }
        }
      ),
      symbols: raw.library.symbols.symbol,
    },
  }
}
