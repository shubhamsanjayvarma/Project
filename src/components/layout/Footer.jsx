import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/logo-text.png';
import './Footer.css';

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
                        <Link to="/shop?category=vintage">Vintage</Link>
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

                    {/* 4. Payment Badges Grid */}
                    <div className="footer-payment-grid">
                        {/* AMEX */}
                        <div className="payment-logo-card payment-logo-amex">
                            <span className="logo-text-bold">AMEX</span>
                        </div>
                        {/* Apple Pay */}
                        <div className="payment-logo-card payment-logo-apple">
                            <span className="logo-apple-icon"></span>Pay
                        </div>
                        {/* Bancontact */}
                        <div className="payment-logo-card payment-logo-bancontact">
                            <span className="logo-bancontact-b">b</span>
                            <span className="logo-bancontact-text">contact</span>
                        </div>
                        {/* Blik */}
                        <div className="payment-logo-card payment-logo-blik">
                            blik
                        </div>
                        {/* Google Pay */}
                        <div className="payment-logo-card payment-logo-gpay">
                            <span className="logo-gpay-g"><span className="g-blue">G</span><span className="g-red">o</span><span className="g-yellow">o</span><span className="g-green">g</span></span> Pay
                        </div>
                        {/* Wero */}
                        <div className="payment-logo-card payment-logo-wero">
                            wero
                        </div>
                        {/* Mastercard */}
                        <div className="payment-logo-card payment-logo-mastercard">
                            <div className="mc-circles">
                                <div className="mc-circle mc-red"></div>
                                <div className="mc-circle mc-orange"></div>
                            </div>
                        </div>
                        {/* Maestro */}
                        <div className="payment-logo-card payment-logo-maestro">
                            <div className="mc-circles">
                                <div className="mc-circle mc-red"></div>
                                <div className="mc-circle mc-blue"></div>
                            </div>
                        </div>
                        {/* Shop Pay */}
                        <div className="payment-logo-card payment-logo-shoppay">
                            shop<span className="pay-text">Pay</span>
                        </div>
                        {/* UnionPay */}
                        <div className="payment-logo-card payment-logo-unionpay">
                            <div className="up-colors">
                                <span className="up-red">Union</span>
                                <span className="up-blue">Pay</span>
                            </div>
                        </div>
                        {/* Visa */}
                        <div className="payment-logo-card payment-logo-visa">
                            VISA
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
