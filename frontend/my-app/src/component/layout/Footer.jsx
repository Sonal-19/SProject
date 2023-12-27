import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer id="footer" className="footerF p-1">
        <div className="container footer-top p-3">
          <div className="row gy-4">
            <div className="col-6 footer-about">
              <a href="index.html" className="logo d-flex align-items-center">
                <span>Append</span>
              </a>
              <p>Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.
              Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.
              Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.
              </p>
              <div className="social-links d-flex mt-4 ">
                <Link to="https://twitter.com/?lang=en" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} className='me-2' style={{color:'black', fontSize:'24px'}} />
                </Link>
                <Link to="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} className='me-2' style={{color:'black', fontSize:'24px'}}/>
                </Link>
                <Link to="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} className='me-2' style={{color:'black', fontSize:'24px'}} />
                </Link>
                <Link to="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLinkedin} className='me-2' style={{color:'black', fontSize:'24px'}}/>
                </Link>
              </div>
            </div>

            <div className="col-3 footer-links text-center">
              <h5>CUSTOMER POLICIES</h5>
              <ul>
                <li> <Link to="/userblog">Blog</Link></li>
                <li> <Link to="/contactus">Contact us</Link></li>
                <li> <Link to="/accessibilityview">Accessibility</Link></li>
                <li><Link to="/termsofuse">Terms of Use</Link></li>
                <li><Link to="/privacy-policy">Privacy policy</Link></li>
                <li><Link to="/t&c">Terms & Conditions </Link></li>
              </ul>
            </div>

            <div className="col-3 footer-contact text-center">
              <h4>Contact Us</h4>
              <p>A108 Adam Street</p>
              <p>New York, NY 535022</p>
              <p>United States</p>
              <p className="mt-2"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
              <p><strong>Email:</strong> <span>info@example.com</span></p>
            </div>
          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>© <span>Copyright</span> <strong className="px-1">Append</strong> <span>All Rights Reserved</span></p>
          <div className="credits">
          </div>
        </div>
      </footer>
    </>
  );
}
