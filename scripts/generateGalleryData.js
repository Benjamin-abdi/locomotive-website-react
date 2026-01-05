import fs from "fs"
import path from "path"

function parseSource(rawSource) {
  // Remove trailing numbers like " 2", " 3"
  const cleaned = rawSource.replace(/\s\d+$/, "").trim()

  const facebookGroups = [
    "Railcolor Photo Group",
    "Die Vectron-Lokfamilie ( inkl. Smartron, Dieselvectron & Dualmode )",
    "Elektrické LOKOMOTIVY & jednotky"
  ]

  if (facebookGroups.includes(cleaned)) {
    return {
      type: "facebook",
      label: cleaned,
      url: null
    }
  }

  return {
    type: "website",
    label: cleaned,
    url: cleaned.startsWith("http")
      ? cleaned
      : `https://${cleaned}`
  }
}

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
  // Company name = before the first underscore
  const rawCompany = file.split("_")[0]
  const company = rawCompany.trim()

  const safeCompany = safeName(company)

  if (!counters[safeCompany]) counters[safeCompany] = 1
  const index = counters[safeCompany]++

  const varName = `${safeCompany}${index}`

  imports += `import ${varName} from "../assets/gallery/${file}"\n`

  // Extract source part from filename
  const fileName = file.replace(".jpg", "")
  const parts = fileName.split("_")
  const rawSource = parts.slice(1).join("_").trim()

  const source = parseSource(rawSource)

  data.push(
    `  {
      id: ${id++},
      company: "${company}",
      image: ${varName},
      source: {
        type: "${source.type}",
        label: "${source.label}",
        url: ${source.url ? `"${source.url}"` : null}
      }
    }`
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
