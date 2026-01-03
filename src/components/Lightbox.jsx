import { useEffect, useState, useRef } from "react"

function Lightbox({
  image,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const start = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [image])

  useEffect(() => {
    const handleKey = e => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && hasNext) onNext()
      if (e.key === "ArrowLeft" && hasPrev) onPrev()
    }

    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = "auto"
    }
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  const handleWheel = e => {
    e.preventDefault()
    setScale(prev =>
      Math.min(4, Math.max(1, prev - e.deltaY * 0.001))
    )
  }

  const handleDoubleClick = () => {
    setScale(prev => (prev === 1 ? 2 : 1))
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = e => {
    dragging.current = true
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleMouseMove = e => {
    if (!dragging.current) return
    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y
    })
  }

  const handleMouseUp = () => {
    dragging.current = false
  }

  if (!image) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {hasPrev && (
        <button
          className="lightbox-nav left"
          onClick={e => {
            e.stopPropagation()
            onPrev()
          }}
        >
          ‹
        </button>
      )}

      <img
        src={image.image}
        alt={image.company}
        className="lightbox-image"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
        onClick={e => e.stopPropagation()}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        draggable={false}
      />

      {hasNext && (
        <button
          className="lightbox-nav right"
          onClick={e => {
            e.stopPropagation()
            onNext()
          }}
        >
          ›
        </button>
      )}

      <button className="lightbox-close" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

export default Lightbox