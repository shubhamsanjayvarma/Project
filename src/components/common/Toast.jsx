import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertCircle, FiInfo, FiX, FiLoader } from 'react-icons/fi';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000, explicitId = null) => {
        const id = explicitId || ++toastId;
        setToasts(prev => {
            const existingIndex = prev.findIndex(t => t.id === id);
            if (existingIndex >= 0) {
                const newToasts = [...prev];
                newToasts[existingIndex] = { id, message, type };
                return newToasts;
            }
            return [...prev, { id, message, type }];
        });

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = (msg, options) => addToast(msg, 'success', 3000, options?.id);
    const error = (msg, options) => addToast(msg, 'error', 5000, options?.id);
    const info = (msg, options) => addToast(msg, 'info', 3000, options?.id);
    const warning = (msg, options) => addToast(msg, 'warning', 4000, options?.id);
    const loading = (msg, options) => addToast(msg, 'loading', 0, options?.id);

    const icons = { success: FiCheck, error: FiAlertCircle, info: FiInfo, warning: FiAlertCircle, loading: FiLoader };

    return (
        <ToastContext.Provider value={{ addToast, success, error, info, warning, loading, removeToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const Icon = icons[toast.type] || FiInfo;
                        return (
                            <motion.div
                                key={toast.id}
                                className={`toast toast-${toast.type}`}
                                initial={{ opacity: 0, y: -20, x: 50 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Icon size={18} className={toast.type === 'loading' ? 'toast-icon-spin' : ''} />
                                <span>{toast.message}</span>
                                {toast.type !== 'loading' && (
                                    <button onClick={() => removeToast(toast.id)} className="toast-close">
                                        <FiX size={14} />
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
