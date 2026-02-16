import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, CreditCard, QrCode, ArrowLeft, Weight, Package, DollarSign } from 'lucide-react';
import QRCode from 'react-qr-code';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [], totalPrice = 0, totalWeight = 0, totalItems = 0 } = location.state || {};

    const [step, setStep] = useState('review'); // review | security | payment | success
    const [weightStatus, setWeightStatus] = useState(null); // 'pass' | 'flag'
    const [transactionId] = useState(`TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

    // Mock weight check: simulate weight API
    const runWeightCheck = () => {
        setStep('security');
        setTimeout(() => {
            // Simulate: 85% chance of pass, 15% flag
            const expectedWeight = totalWeight;
            const measuredWeight = expectedWeight * (0.9 + Math.random() * 0.2); // ±10% variance
            const discrepancy = Math.abs(measuredWeight - expectedWeight) / expectedWeight;

            if (discrepancy > 0.15) {
                setWeightStatus('flag');
            } else {
                setWeightStatus('pass');
            }
        }, 2000);
    };

    const handlePayment = () => {
        setStep('payment');
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const qrData = JSON.stringify({
        transactionId,
        totalWeight: totalWeight.toFixed(2),
        totalItems,
        timestamp: new Date().toISOString(),
        store: JSON.parse(localStorage.getItem('currentStore') || '{}').name || 'Unknown'
    });

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">No items in cart</p>
                    <button onClick={() => navigate('/scan')} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
                        Go to Scanner
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-lg text-slate-900">Checkout</h1>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto space-y-4">
                {/* Order Summary Card */}
                <motion.div layout className="bg-white rounded-2xl p-5 shadow-card">
                    <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">{item.qty}</span>
                                    <span className="text-slate-700">{item.name}</span>
                                </div>
                                <span className="font-semibold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-100 mt-4 pt-4 grid grid-cols-3 gap-3">
                        {[
                            { icon: Package, label: 'Items', value: totalItems },
                            { icon: Weight, label: 'Weight', value: `${totalWeight.toFixed(1)}kg` },
                            { icon: DollarSign, label: 'Total', value: `₹${totalPrice.toFixed(2)}` },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="text-center">
                                <Icon size={16} className="mx-auto text-slate-400 mb-1" />
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className="text-sm font-bold text-slate-900">{value}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Step: Review */}
                {step === 'review' && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={runWeightCheck}
                        className="w-full py-4 bg-amber-500 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                    >
                        <Shield size={20} /> Run Security Check
                    </motion.button>
                )}

                {/* Step: Security */}
                {step === 'security' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl p-5 shadow-card"
                    >
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Shield size={18} className="text-amber-500" /> Weight Verification
                        </h3>
                        {weightStatus === null ? (
                            <div className="flex flex-col items-center py-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full mb-4"
                                />
                                <p className="text-sm text-slate-500">Verifying bag weight...</p>
                            </div>
                        ) : weightStatus === 'pass' ? (
                            <div className="text-center py-4">
                                <CheckCircle2 size={48} className="mx-auto text-primary mb-3" />
                                <p className="font-semibold text-primary">Weight Check Passed ✓</p>
                                <p className="text-sm text-slate-500 mt-1">All items accounted for</p>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePayment}
                                    className="w-full mt-4 py-4 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                                >
                                    <CreditCard size={18} /> Pay ₹{totalPrice.toFixed(2)}
                                </motion.button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <AlertTriangle size={48} className="mx-auto text-amber-500 mb-3" />
                                <p className="font-semibold text-amber-600">Weight Discrepancy Detected</p>
                                <p className="text-sm text-slate-500 mt-1">Transaction flagged for manual review</p>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => { setWeightStatus(null); runWeightCheck(); }}
                                        className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                                    >
                                        Retry
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePayment}
                                        className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold"
                                    >
                                        Proceed Anyway
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step: Payment */}
                {step === 'payment' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center py-12"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full mb-6"
                        />
                        <p className="font-semibold text-slate-900">Processing Payment...</p>
                        <p className="text-sm text-slate-500 mt-1">Please wait</p>
                    </motion.div>
                )}

                {/* Step: Success */}
                {step === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 shadow-card text-center"
                    >
                        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                            <CheckCircle2 size={40} className="text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Payment Successful!</h2>
                        <p className="text-sm text-slate-500 mb-6">Show this QR code at the exit</p>

                        {/* QR Code */}
                        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-slate-200 inline-block mb-4">
                            <QRCode value={qrData} size={180} level="H" />
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1 mb-6">
                            <p><span className="font-semibold text-slate-700">Transaction:</span> {transactionId}</p>
                            <p><span className="font-semibold text-slate-700">Items:</span> {totalItems} · <span className="font-semibold text-slate-700">Weight:</span> {totalWeight.toFixed(1)}kg</p>
                            <p><span className="font-semibold text-slate-700">Amount:</span> ₹{totalPrice.toFixed(2)}</p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                        >
                            Back to Home
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
