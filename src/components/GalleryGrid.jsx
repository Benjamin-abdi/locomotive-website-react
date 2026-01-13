import { useState, useEffect } from "react"
import galleryData from "../data/galleryData"
import Lightbox from "./Lightbox"
import { companyInfo, companyLogos } from "../data/companyInfo"


function GalleryGrid() {
  const [selectedCompany, setSelectedCompany] = useState("All")
  const [currentIndex, setCurrentIndex] = useState(null)
  const [isLoading, setIsLoading] = useState(true)


  const companies = ["All", ...new Set(galleryData.map(i => i.company))]

  const companyData = companyInfo[selectedCompany]
  const logo = companyLogos[selectedCompany]

  const filteredData =
    selectedCompany === "All"
      ? galleryData
      : galleryData.filter(i => i.company === selectedCompany)

  useEffect(() => {
    setIsLoading(true)

    const preload = filteredData.map(item => {
      return new Promise(resolve => {
        const img = new Image()
        img.src = item.image
        img.onload = resolve
        img.onerror = resolve
      })
    })

    Promise.all(preload).then(() => {
      setIsLoading(false)
    })
  }, [filteredData])

  const openLightbox = index => {
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setCurrentIndex(null)
  }

  const next = () => {
    setCurrentIndex(i =>
      i < filteredData.length - 1 ? i + 1 : i
    )
  }

  const prev = () => {
    setCurrentIndex(i => (i > 0 ? i - 1 : i))
  }

  const preloadImages = images => {
    return Promise.all(
      images.map(
        img =>
          new Promise(resolve => {
            const i = new Image()
            i.src = img.image
            i.onload = resolve
            i.onerror = resolve
          })
      )
    )
  }


  return (
    <>
      <select
        value={selectedCompany}
        onChange={e => {
          setSelectedCompany(e.target.value)
          setCurrentIndex(null)
        }}
      >
        {companies.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Company header with logo and text */}
      {selectedCompany !== "All" && (companyData || logo) && (
        <div className="company-header">
          {logo && (
            <img
              src={logo}
              alt={selectedCompany}
              className="company-logo"
            />
          )}

          {companyData?.description && (
            <div className="company-text">
              <h2>{selectedCompany}</h2>
              <p>{companyData.description}</p>
            </div>
          )}
        </div>
      )}

      {/*For loading animation */}
      {isLoading && (
        <div className="gallery-loading">
          <div className="spinner" />
          <p>Loading images…</p>
        </div>
      )}

      <div className="gallery-grid">
        {!isLoading &&
          filteredData.map((item, index) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img src={item.image} alt={item.company} loading="lazy"/>
            </div>
          ))}
      </div>

      {currentIndex !== null && (
        <Lightbox
          image={filteredData[currentIndex]}
          images={filteredData}
          index={currentIndex}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < filteredData.length - 1}
          onPrev={prev}
          onNext={next}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}

export default GalleryGrid