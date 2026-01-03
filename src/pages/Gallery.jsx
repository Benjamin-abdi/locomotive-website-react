import FeaturedGallery from "../components/FeaturedGallery"
import GalleryGrid from "../components/GalleryGrid"

function Gallery() {
  return (
    <div className="page">
      <FeaturedGallery />

      {/* Tu pôjdu DESIATKY ďalších obrázkov */}
      <GalleryGrid />
    </div>
  )
}

export default Gallery
