import "../styles/Footer.scss"
import { LocationOn, LocalPhone, Email } from "@mui/icons-material"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <a href="/"><img src="/assets/logo_1.png" alt="logo" /></a>
      </div>

      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
          <li><Link to="/return-and-refund-policy">Return and Refund Policy</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocalPhone />
          <a href="tel:+912345678900" style={{ color: "black", textDecoration: "none" }}>+91 234 567 890</a>
        </div>
        <div className="footer_right_info">
          <Email />
          <a href="mailto:shreeharirentals@support.com" style={{ color: "black", textDecoration: "none" }}>shreeharirentals@support.com</a>
        </div>
        <img src="/assets/payment.png" alt="payment" />
      </div>
    </div>
  )
}

export default Footer