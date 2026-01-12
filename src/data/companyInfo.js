import companies from "./companies.json"

const logoModules = import.meta.glob("../assets/logos/*.png", {
  eager: true
})

// Convert modules to map: { "ZSSK": "/assets/ZSSK.png", ... }
const logos = {}

for (const path in logoModules) {
  const file = path.split("/").pop()
  const name = file.replace(".png", "")
  logos[name] = logoModules[path].default
}

export const companyInfo = {}
export const companyLogos = logos

// Attach logos automatically if they exist
for (const company in companies) {
  companyInfo[company] = {
    description: companies[company].description
  }

  // Attach logo only if it exists
  if (logos[company]) {
    companyInfo[company].logo = logos[company]
  }
}