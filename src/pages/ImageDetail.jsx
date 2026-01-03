import { useParams } from "react-router-dom"
import galleryData from "../data/galleryData"

function ImageDetail() {
  const { id } = useParams()

  const image = galleryData.find(item => item.id === id)

  if (!image) {
    return <h2>Pictoure has not been found!</h2>
  }

  return (
    <div className="page">
      <h2>{image.title}</h2>
      <img
        src={image.image}
        alt={image.title}
        style={{ maxWidth: "100%", marginBottom: "20px" }}
      />
      <p>Company: {image.company}</p>
    </div>
  )
}

export default ImageDetail
