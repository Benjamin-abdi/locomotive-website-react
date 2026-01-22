import { Link } from "react-router-dom"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Left */}
        <div className="footer-section">
          <h3>Vectron Database</h3>
          <p>
            Non-commercial railway photography project focused on
            Siemens Vectron locomotives across Europe.
          </p>
        </div>

        {/* Center */}
        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Right */}
        <div className="footer-section">
          <h4>Credits</h4>
          <p>
            Photos are property of their respective authors and sources.
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Vectron Database · All rights reserved
      </div>
    </footer>
  )
}

export default Footer