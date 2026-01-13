import { Link } from "react-router-dom"
import logo from "../assets/logo/logo.jpg"

function Navbar() {
  return (
    <header className="site-header">
      <div className="logo-bar">
        <img src={logo} alt="Vectron logo" className="logo" />
      </div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/gallery">Gallery</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
