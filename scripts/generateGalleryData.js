import fs from "fs"
import path from "path"

const imagesDir = path.resolve("src/assets/gallery")
const outputFile = path.resolve("src/data/galleryData.js")

const files = fs
  .readdirSync(imagesDir)
  .filter(file => file.toLowerCase().endsWith(".jpg"))

let imports = ""
let data = []
let counters = {}
let id = 1

// function for safe JS name - stupid naming of files
function safeName(text) {
  return text
    .normalize("NFD")                 // removes diacritics
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")        // removes spaces and symbols
}

files.forEach(file => {
  // name of the company = before the first _
  const rawCompany = file.split("_")[0]
  const company = rawCompany.trim()

  const safeCompany = safeName(company)

  if (!counters[safeCompany]) counters[safeCompany] = 1
  const index = counters[safeCompany]++

  const varName = `${safeCompany}${index}`

  imports += `import ${varName} from "../assets/gallery/${file}"\n`

  data.push(
    `  { id: ${id++}, company: "${company}", image: ${varName} }`
  )
})

const content = `
${imports}

const galleryData = [
${data.join(",\n")}
]

export default galleryData
`

fs.writeFileSync(outputFile, content.trim())

console.log("galleryData.js has been generated correctly")
