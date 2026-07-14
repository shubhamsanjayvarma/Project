import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/logo-text.png';
import './Footer.css';

// Local SVG imports for payment logos
import visaIcon from '../../assets/visa.svg';
import mastercardIcon from '../../assets/mastercard.svg';
import amexIcon from '../../assets/amex.svg';
import applePayIcon from '../../assets/apple-pay.svg';
import googlePayIcon from '../../assets/google-pay.svg';
import bancontactIcon from '../../assets/bancontact.svg';
import blikIcon from '../../assets/blik.svg';
import idealIcon from '../../assets/ideal.svg';
import sofortIcon from '../../assets/sofort.svg';
import giropayIcon from '../../assets/giropay.svg';
import epsIcon from '../../assets/eps.svg';
import unionpayIcon from '../../assets/unionpay.svg';
import weroIcon from '../../assets/wero.svg';
import shoppayIcon from '../../assets/shoppay.svg';
import stripeIcon from '../../assets/stripe.svg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-wave"></div>
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <img src={logo} alt="Second Thrift" className="footer-logo" width="640" height="640" loading="lazy" decoding="async" />
                        <p>Discover unique pre-loved clothing from Europe. Sustainable fashion at wholesale prices.</p>
                        <div className="footer-social">
                            <a href="https://www.instagram.com/second._.thriftt?igsh=MTU5MXd0ZDV3bDVsbA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram size={20} /></a>
                            <a href="https://facebook.com/secondthrift" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook size={20} /></a>
                            <a href="https://tiktok.com/@secondthrift" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><SiTiktok size={18} /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <Link to="/shop">Shop All</Link>
                        <Link to="/shop?category=bulk-deals">Bulk Deals</Link>
                        <Link to="/shop?category=designer">Designer</Link>
                        <Link to="/about">About Us</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Customer Service</h4>
                        <Link to="/contact">Contact Us</Link>
                        <Link to="/shipping">Shipping Info</Link>
                        <Link to="/track">Track Shipment</Link>
                        <Link to="/returns">Returns & Refunds</Link>
                        <Link to="/faq">FAQ</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Contact</h4>
                        <div className="footer-contact-item">
                            <FiMail size={16} />
                            <a href="mailto:secondthriftt39@gmail.com">secondthriftt39@gmail.com</a>
                        </div>
                        <div className="footer-contact-item">
                            <FaWhatsapp size={16} />
                            <a href="https://wa.me/919909527515" target="_blank" rel="noopener noreferrer">+91 9909527515</a>
                        </div>
                        <div className="footer-contact-item">
                            <FiInstagram size={16} />
                            <a href="https://www.instagram.com/second._.thriftt?igsh=MTU5MXd0ZDV3bDVsbA==" target="_blank" rel="noopener noreferrer">@second._.thriftt</a>
                        </div>
                        <div className="footer-contact-item">
                            <FiMapPin size={16} />
                            <span>India Based</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-shopify">
                    {/* 1. Currency selector */}
                    <div className="footer-currency-selector">
                        <button className="currency-selector-btn">
                            <span>EUR €</span>
                            <FiChevronDown size={14} />
                        </button>
                    </div>

                    {/* 2. Copyright */}
                    <p className="footer-copyright-shopify">
                        &copy; {new Date().getFullYear()}, <Link to="/">Second Thrift</Link>. Powered by Second Thrift.
                    </p>

                    {/* 3. Sub-navigation links */}
                    <div className="footer-sub-links">
                        <Link to="/">Home</Link>
                        <Link to="/shop">All products</Link>
                        <Link to="/shop">Collections</Link>
                        <Link to="/about">Size</Link>
                        <Link to="/shop">Brands</Link>
                    </div>

                    {/* Stripe Secured Logo */}
                    <div className="footer-stripe-banner">
                        <span className="stripe-secure-text">SECURED BY</span>
                        <img 
                            src={stripeIcon} 
                            alt="Stripe" 
                            className="footer-stripe-logo" 
                            width="80" 
                            height="32" 
                            loading="lazy"
                        />
                    </div>

                    {/* 4. Payment Badges Grid */}
                    <div className="footer-payment-grid">
                        {/* Visa */}
                        <div className="payment-logo-card">
                            <img src={visaIcon} alt="Visa" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Mastercard */}
                        <div className="payment-logo-card">
                            <img src={mastercardIcon} alt="Mastercard" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* American Express */}
                        <div className="payment-logo-card">
                            <img src={amexIcon} alt="American Express" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Apple Pay */}
                        <div className="payment-logo-card">
                            <img src={applePayIcon} alt="Apple Pay" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Google Pay */}
                        <div className="payment-logo-card">
                            <img src={googlePayIcon} alt="Google Pay" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Bancontact */}
                        <div className="payment-logo-card">
                            <img src={bancontactIcon} alt="Bancontact" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Blik */}
                        <div className="payment-logo-card">
                            <img src={blikIcon} alt="Blik" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Wero */}
                        <div className="payment-logo-card">
                            <img src={weroIcon} alt="Wero" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Shop Pay */}
                        <div className="payment-logo-card">
                            <img src={shoppayIcon} alt="Shop Pay" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* UnionPay */}
                        <div className="payment-logo-card">
                            <img src={unionpayIcon} alt="UnionPay" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* iDEAL (Netherlands) */}
                        <div className="payment-logo-card">
                            <img src={idealIcon} alt="iDEAL" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Sofort / Klarna (Germany/Austria) */}
                        <div className="payment-logo-card">
                            <img src={sofortIcon} alt="Sofort" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* Giropay (Germany) */}
                        <div className="payment-logo-card">
                            <img src={giropayIcon} alt="Giropay" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                        {/* EPS (Austria) */}
                        <div className="payment-logo-card">
                            <img src={epsIcon} alt="EPS" className="payment-logo-img" width="50" height="32" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
