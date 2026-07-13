import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiTruck, FiActivity } from 'react-icons/fi';
import { useSEO } from '../utils/seo';
import { useToast } from '../components/common/Toast';
import './TrackShipment.css';

const TrackShipment = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();
    const [trackingInput, setTrackingInput] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useSEO({
        title: 'Track Shipment',
        description: 'Track your package delivery live updates from Second Thrift.',
        path: '/track'
    });

    const handleTrack = async (awb) => {
        if (!awb || !awb.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/shipglobal/track/${awb.trim()}`);
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch tracking details');
            }
            setTrackingData(data.data);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Unable to retrieve tracking updates. Please verify the AWB number.');
            setTrackingData(null);
        } finally {
            setLoading(false);
        }
    };

    // Auto-track if 'awb' is provided in the URL query string
    useEffect(() => {
        const awbParam = searchParams.get('awb');
        if (awbParam) {
            setTrackingInput(awbParam);
            handleTrack(awbParam);
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingInput.trim()) {
            setSearchParams({ awb: trackingInput.trim() });
        }
    };

    return (
        <div className="track-page">
            <div className="container track-container">
                <div className="track-card">
                    <div className="track-header">
                        <h1>Track Shipment</h1>
                        <p>Enter your Ship Global AWB tracking number to view real-time delivery milestones.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="track-form">
                        <div className="track-input-wrapper">
                            <input
                                type="text"
                                className="track-input"
                                placeholder="e.g. SG3240206590212"
                                value={trackingInput}
                                onChange={(e) => setTrackingInput(e.target.value)}
                                required
                            />
                            <FiSearch className="track-input-icon" size={18} />
                        </div>
                        <button type="submit" className="btn btn-primary track-button" disabled={loading}>
                            {loading ? 'Tracking...' : <><FiTruck /> Track</>}
                        </button>
                    </form>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--primary)' }}>
                            <div className="spinner" style={{ margin: '0 auto 12px auto' }} />
                            Retrieving live tracking milestones...
                        </div>
                    )}

                    {!loading && searched && trackingData && (
                        <div>
                            <div className="track-info-grid">
                                <div>
                                    <span className="track-info-label">Carrier</span>
                                    <span className="track-info-val">Ship Global</span>
                                </div>
                                <div>
                                    <span className="track-info-label">AWB Tracking Number</span>
                                    <span className="track-info-val" style={{ fontFamily: 'monospace' }}>{trackingData.awbInfo?.awb_number}</span>
                                </div>
                                <div>
                                    <span className="track-info-label">Current Status</span>
                                    <span className="track-info-val" style={{ color: 'var(--primary)' }}>{trackingData.awbInfo?.awb_status || 'IN TRANSIT'}</span>
                                </div>
                                <div>
                                    <span className="track-info-label">Destination Country</span>
                                    <span className="track-info-val">{trackingData.awbInfo?.dest_country_code || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="track-timeline-wrapper">
                                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiActivity size={18} style={{ color: 'var(--primary)' }} /> Shipment Timeline
                                </h3>

                                {trackingData.awbEvents && trackingData.awbEvents.length > 0 ? (
                                    <div className="track-timeline">
                                        {trackingData.awbEvents.map((evt, idx) => (
                                            <div key={idx} className={`track-timeline-item ${idx === 0 ? 'active' : ''}`}>
                                                <div className="track-timeline-dot" />
                                                <div className="track-event-comment">
                                                    {evt.awb_history_comment}
                                                </div>
                                                <div className="track-event-meta">
                                                    {evt.awb_history_datetime} • {evt.awb_history_location || 'Transit Hub'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="track-empty-state">
                                        Shipment registered. Awaiting parcel scan by carrier.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!loading && searched && !trackingData && (
                        <div className="track-empty-state">
                            No tracking events found. Please make sure the AWB number is entered correctly.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackShipment;
