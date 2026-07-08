import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiPackage, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { formatPrice, ORDER_STATUSES } from '../utils/helpers';
import { getOrdersByUser } from '../services/orders';
import './Orders.css';

const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingOrderId, setPayingOrderId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUser(user.uid);
                setOrders(data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate, toast]);

    const handleResumePayment = async (order) => {
        setPayingOrderId(order.id);
        try {
            toast.loading('Redirecting to secure payment...', { id: 'payment-toast' });
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    items: order.items || [],
                    total: order.paymentTotal || order.total,
                    currency: order.paymentCurrency || order.displayCurrency || 'EUR',
                    customerEmail: user.email,
                }),
            });

            if (!res.ok) throw new Error('Failed to create payment session');
            const { url } = await res.json();
            if (url) window.location.href = url;
            else throw new Error('No checkout URL returned');
        } catch (err) {
            console.error(err);
            toast.error('Failed to initialize payment. Please try again.', { id: 'payment-toast' });
            setPayingOrderId(null);
        }
    };

    if (loading) {
        return <div className="orders-page"><div className="container" style={{textAlign:'center', padding:'4rem'}}>Loading your orders...</div></div>;
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="orders-title">My Orders</h1>

                {orders.length === 0 ? (
                    <motion.div
                        className="orders-empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <FiShoppingBag size={56} />
                        <h2>No orders yet</h2>
                        <p>When you place orders, they will appear here.</p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                            <FiPackage /> Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => {
                            const statusInfo = ORDER_STATUSES[order.status] || {};
                            return (
                                <motion.div
                                    key={order.id}
                                    className="order-card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="order-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                                            <span className="order-date">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-GB') : 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                                                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                                            </span>
                                            <span className={`badge badge-${statusInfo.color}`}>
                                                {statusInfo.icon} {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="order-card-items">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="order-item">
                                                <span>{item.name} × {item.quantity || item.qty}</span>
                                                <span>{formatPrice((item.price || 0) * (item.quantity || item.qty))}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <span className="order-total">Total: {formatPrice(order.total)}</span>
                                        
                                        {order.paymentStatus === 'pending' && (
                                            <button 
                                                className="btn btn-primary btn-sm" 
                                                disabled={payingOrderId === order.id}
                                                onClick={() => handleResumePayment(order)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                {payingOrderId === order.id ? 'Redirecting...' : <><FiCreditCard /> Pay Now</>}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
