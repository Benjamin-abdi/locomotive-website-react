import featuredData from "../data/featuredData"

function FeaturedGallery() {
  return (
    <div className="featured-gallery">
      {featuredData.map(item => (
        <img
          key={item.id}
          src={item.image}
          alt={item.title}
        />
      ))}
    </div>
  )
}

export default FeaturedGallery
