import { Link } from "react-router-dom"
import logo from "../assets/logo/logo.jpg"

function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="Vectron logo" className="logo" />

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
  )
}

export default Navbar
