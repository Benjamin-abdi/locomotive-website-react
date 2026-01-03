import { useState } from "react"
import galleryData from "../data/galleryData"
import Lightbox from "./Lightbox"

function GalleryGrid() {
  const [selectedCompany, setSelectedCompany] = useState("All")
  const [currentIndex, setCurrentIndex] = useState(null)

  const companies = ["All", ...new Set(galleryData.map(i => i.company))]

  const filteredData =
    selectedCompany === "All"
      ? galleryData
      : galleryData.filter(i => i.company === selectedCompany)

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

      <div className="masonry">
        {filteredData.map((item, index) => (
          <div
            key={item.id}
            className="masonry-item"
            onClick={() => openLightbox(index)}
          >
            <img src={item.image} alt={item.company} />
          </div>
        ))}
      </div>

      {currentIndex !== null && (
        <Lightbox
          image={filteredData[currentIndex]}
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
