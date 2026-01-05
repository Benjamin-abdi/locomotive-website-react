import { useEffect, useState, useRef } from "react"

function Lightbox({
  image,
  images,
  index,
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

  const pinchStartDistance = useRef(null)
  const pinchStartScale = useRef(1)

  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  const lastTapTime = useRef(0) // For double tap

  // Make sure that it works!!!!!!!!!!!!!!!!!!!
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [image])

  // Preload next and previous images
  useEffect(() => {
    if (!image || !images) return

    if (hasNext && images[index + 1]) {
      const nextImg = new Image()
      nextImg.src = images[index + 1].image
    }

    if (hasPrev && images[index - 1]) {
      const prevImg = new Image()
      prevImg.src = images[index - 1].image
    }
  }, [image, images, index, hasNext, hasPrev])

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

  // Mouse wheel zoom
  const handleWheel = e => {
    e.preventDefault()
    setScale(prev =>
      Math.min(4, Math.max(1, prev - e.deltaY * 0.001))
    )
  }

  // Double click zoom toggle
  const handleDoubleClick = () => {
    setScale(prev => (prev === 1 ? 2 : 1))
    setPosition({ x: 0, y: 0 })
  }

  // Mouse drag
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

  // Touch swipe start
  const handleTouchStart = e => {
    const now = Date.now()

    // Double tap detection (mobile)
    if (e.touches.length === 1) {
      if (now - lastTapTime.current < 300) {
        // Double tap detected
        setScale(prev => (prev === 1 ? 2 : 1))
        setPosition({ x: 0, y: 0 })
        lastTapTime.current = 0
        return
      }

      lastTapTime.current = now

      // Swipe start only if not zoomed
      if (scale === 1) {
        touchStartX.current = e.touches[0].clientX
      }
    }

    // Pinch start
    if (e.touches.length === 2) {
      pinchStartDistance.current = getDistance(e.touches)
      pinchStartScale.current = scale
    }
  }

  const handleTouchMove = e => {
    if (e.touches.length === 2 && pinchStartDistance.current) {
      // Pinch zoom
      const newDistance = getDistance(e.touches)
      const zoomFactor = newDistance / pinchStartDistance.current

      setScale(
        Math.min(4, Math.max(1, pinchStartScale.current * zoomFactor))
      )
    } else if (e.touches.length === 1 && scale === 1) {
      // Swipe move
      touchEndX.current = e.touches[0].clientX
    }
  }

  const handleTouchEnd = () => {
    pinchStartDistance.current = null

    if (scale !== 1) {
      touchStartX.current = null
      touchEndX.current = null
      return
    }

    if (
      touchStartX.current === null ||
      touchEndX.current === null
    )
      return

    const diff = touchStartX.current - touchEndX.current

    if (diff > 60 && hasNext) onNext()
    else if (diff < -60 && hasPrev) onPrev()

    touchStartX.current = null
    touchEndX.current = null
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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