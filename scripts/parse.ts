import fs from "fs"
import { parseEagleXML } from "parse"

async function main() {
  const file = await fs.promises.readFile(process.argv[2])
  console.dir(parseEagleXML(file.toString()), {
    depth: 1000,
  })
  if (process.argv[3]) {
    await fs.promises.writeFile(
      process.argv[3],
      JSON.stringify(parseEagleXML(file.toString()), null, "  ")
    )
  }
}

main()
