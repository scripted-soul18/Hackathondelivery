import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Store, Truck, ScanLine, Zap, Shield, Clock, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* Google "G" SVG logo – official brand colors */
const GoogleLogo = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.998 23.998 0 000 24c0 3.77.87 7.36 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

/* Animated floating shapes for the hero background */
const FloatingShape = ({ delay, size, x, y, color }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            x: [x, x + 30, x],
            y: [y, y - 20, y],
        }}
        transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute rounded-full blur-2xl pointer-events-none ${color}`}
        style={{ width: size, height: size }}
    />
);

const Landing = () => {
    const { signInWithGoogle, user, role, signOut } = useAuth();
    const navigate = useNavigate();
    const [loginLoading, setLoginLoading] = useState(null); // 'customer' | 'owner'

    const handleLogin = async (selectedRole) => {
        setLoginLoading(selectedRole);
        try {
            await signInWithGoogle(selectedRole);
            if (selectedRole === 'owner') {
                navigate('/owner-dashboard');
            }
            // customer stays on '/' — shows the Scan & Go / Delivery choice page
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoginLoading(null);
        }
    };

    /* ─────────────── REDIRECT OWNER TO DASHBOARD ─────────────── */
    useEffect(() => {
        if (user && role === 'owner') {
            navigate('/owner-dashboard', { replace: true });
        }
    }, [user, role, navigate]);

    if (user && role === 'owner') return null; // avoid flash while redirecting

    /* ─────────────── LOGGED-IN CUSTOMER DASHBOARD ─────────────── */
    if (user) {
        const displayName = user.user_metadata?.full_name || user.email || 'User';
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
                {/* Glassmorphism Nav */}
                <div className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-br from-primary to-primary-600 rounded-xl shadow-lg shadow-primary/20">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">SwiftCart</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full pl-1 pr-3 py-1">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <User size={14} className="text-white" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 hidden sm:inline">{displayName}</span>
                        </div>
                        <button
                            onClick={() => { signOut(); window.location.reload(); }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6 max-w-lg mx-auto space-y-6 pt-6">
                    {/* Greeting */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-sm text-primary font-semibold uppercase tracking-wider">{greeting}</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">{displayName} 👋</h2>
                        <p className="text-slate-500 mt-1">What would you like to do today?</p>
                    </motion.div>

                    {/* Scan & Go Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/store-entry')}
                        className="w-full text-left bg-gradient-to-br from-primary-500 via-primary to-emerald-600 text-white rounded-3xl p-6 shadow-2xl shadow-primary/25 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                        <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/5 rounded-full" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                                    <ScanLine size={26} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Scan & Go</h3>
                                    <p className="text-sm text-white/80">In-store self-checkout</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 mb-5 leading-relaxed">
                                Scan products with your camera, pay instantly, and walk out — no lines, no wait.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold bg-white/15 backdrop-blur-sm w-fit px-4 py-2 rounded-full">
                                Start Shopping <ChevronRight size={16} />
                            </div>
                        </div>
                    </motion.button>

                    {/* Direct Delivery Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/delivery')}
                        className="w-full text-left bg-gradient-to-br from-secondary-500 via-secondary to-purple-700 text-white rounded-3xl p-6 shadow-2xl shadow-secondary/25 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                                    <Truck size={26} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Direct Delivery</h3>
                                    <p className="text-sm text-white/80">Zero-commission local delivery</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 mb-5 leading-relaxed">
                                Order from 5 trusted local shops with real-time tracking — delivered to your door.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold bg-white/15 backdrop-blur-sm w-fit px-4 py-2 rounded-full">
                                Order Now <ChevronRight size={16} />
                            </div>
                        </div>
                    </motion.button>

                    {/* Feature badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-3 gap-3"
                    >
                        {[
                            { icon: Zap, label: 'Instant\nCheckout', color: 'text-amber-500 bg-amber-50' },
                            { icon: Shield, label: 'Secure\nPayment', color: 'text-primary bg-primary-50' },
                            { icon: Clock, label: '10-min\nDelivery', color: 'text-secondary bg-secondary-50' },
                        ].map(({ icon: Icon, label, color }) => (
                            <div key={label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-card border border-white/50 hover:shadow-lg transition-shadow">
                                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                                    <Icon size={20} />
                                </div>
                                <p className="text-[11px] font-semibold text-slate-600 whitespace-pre-line leading-tight">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    }

    /* ─────────────── LOGIN SCREEN ─────────────── */
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans overflow-hidden">
            {/* Left Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full lg:w-[55%] relative flex flex-col justify-center p-8 md:p-16 min-h-[50vh] lg:min-h-screen"
            >
                {/* Animated background shapes */}
                <FloatingShape delay={0} size={300} x={-50} y={-30} color="bg-primary" />
                <FloatingShape delay={2} size={200} x={200} y={100} color="bg-secondary" />
                <FloatingShape delay={4} size={250} x={100} y={300} color="bg-accent" />
                <FloatingShape delay={1} size={150} x={350} y={-50} color="bg-blue-500" />

                {/* Content */}
                <div className="relative z-10 max-w-xl">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 mb-12"
                    >
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <ShoppingBag className="w-8 h-8 text-primary-400" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">SwiftCart</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
                    >
                        Skip the line,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-emerald-300 to-teal-200">
                            save the time.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-lg text-slate-400 mb-10 max-w-md leading-relaxed"
                    >
                        Scan in-store, pay instantly, or get local deliveries in minutes —
                        all with <span className="text-white font-medium">zero commission</span>.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex gap-8"
                    >
                        {[
                            { value: '500+', label: 'Stores' },
                            { value: '2K+', label: 'Users' },
                            { value: '10min', label: 'Delivery' },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Auth Section */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-16"
            >
                <div className="w-full max-w-md bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.6 }}
                            className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
                        >
                            <Sparkles size={28} className="text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-1">Welcome to SwiftCart</h3>
                        <p className="text-slate-400 text-sm">Sign in with Google to continue</p>
                    </div>

                    <div className="space-y-3">
                        {/* Google Login - Customer */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16,185,129,0.15)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLogin('customer')}
                            disabled={loginLoading !== null}
                            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            {loginLoading === 'customer' ? (
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-primary-200 border-t-primary rounded-full" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                    <GoogleLogo />
                                </div>
                            )}
                            <div className="text-left flex-1">
                                <p className="font-semibold text-slate-900 text-sm">Continue as Shopper</p>
                                <p className="text-xs text-slate-500">Sign in with Google</p>
                            </div>
                            <div className="p-2 bg-primary-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <ShoppingBag size={16} />
                            </div>
                        </motion.button>

                        {/* Google Login - Store Owner */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(245,158,11,0.15)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLogin('owner')}
                            disabled={loginLoading !== null}
                            className="w-full flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/15 transition-all group"
                        >
                            {loginLoading === 'owner' ? (
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white/20 border-t-accent rounded-full" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <GoogleLogo />
                                </div>
                            )}
                            <div className="text-left flex-1">
                                <p className="font-semibold text-white text-sm">Continue as Store Owner</p>
                                <p className="text-xs text-slate-400">Sign in with Google</p>
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                <Store size={16} />
                            </div>
                        </motion.button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-transparent px-3 text-xs text-slate-500 uppercase tracking-widest">Secure Login</span>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Shield size={12} /> Encrypted</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><GoogleLogo /> Google OAuth</span>
                        <span>•</span>
                        <span>No passwords</span>
                    </div>

                    <p className="text-center text-[11px] text-slate-600 mt-6">
                        By continuing, you agree to SwiftCart's Terms of Service.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Landing;
