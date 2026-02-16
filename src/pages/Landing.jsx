import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Store, Truck, ScanLine, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const { signInWithGoogle, user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (role) => {
        try {
            await signInWithGoogle(role);
            if (role === 'customer') navigate('/store-entry');
            if (role === 'owner') navigate('/store-entry');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // If already logged in, show the home dashboard
    if (user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
                {/* Nav */}
                <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">SwiftCart</h1>
                    </div>
                    <button
                        onClick={() => {
                            signOut();
                            window.location.reload();
                        }}
                        className="text-sm text-slate-500 hover:text-slate-700"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="p-6 max-w-lg mx-auto space-y-6 pt-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Welcome back! 👋</h2>
                        <p className="text-slate-500 mt-1">What would you like to do today?</p>
                    </div>

                    {/* Scan & Go Card */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/store-entry')}
                        className="w-full text-left bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-5 -mb-5" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <ScanLine size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Scan & Go</h3>
                                    <p className="text-sm text-white/80">In-store self-checkout</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 mb-4">
                                Scan products, pay instantly, and skip the checkout line
                            </p>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                Start Shopping <ChevronRight size={16} />
                            </div>
                        </div>
                    </motion.button>

                    {/* Direct Delivery Card */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/delivery')}
                        className="w-full text-left bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-2xl p-6 shadow-xl shadow-secondary/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-5 -mb-5" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Direct Delivery</h3>
                                    <p className="text-sm text-white/80">Zero-commission local delivery</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 mb-4">
                                Order from 5 local shops with live tracking
                            </p>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                Order Now <ChevronRight size={16} />
                            </div>
                        </div>
                    </motion.button>

                    {/* Feature badges */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        {[
                            { icon: Zap, label: 'Instant Checkout' },
                            { icon: Store, label: 'Local Shops' },
                            { icon: ShoppingBag, label: 'Zero Commission' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="bg-white rounded-xl p-3 text-center shadow-card">
                                <Icon size={20} className="mx-auto text-slate-400 mb-1" />
                                <p className="text-[10px] font-semibold text-slate-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Login screen
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans overflow-hidden">
            {/* Left Section: Branding */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen"
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent blur-3xl"></div>
                </div>

                <div className="z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                            <ShoppingBag className="w-8 h-8 text-primary-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">SwiftCart</h1>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Skip the line, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-200">
                                save the time.
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-light italic">
                            "Your time is currency, spend it wisely."
                        </p>
                    </div>
                </div>

                <div className="z-10 mt-8 md:mt-0">
                    <p className="text-sm text-slate-500 uppercase tracking-widest mb-4">Trusted by 500+ Local Stores</p>
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-slate-400">
                                U{i}
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-slate-800 flex items-center justify-center text-xs text-primary-400">
                            +2k
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Section: Auth */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center bg-white"
            >
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Get Started</h3>
                        <p className="text-slate-500">Choose your role to continue</p>
                    </div>

                    <div className="space-y-4">
                        {/* Customer */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLogin('customer')}
                            className="w-full flex items-center justify-between p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-primary transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-primary-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                    <ShoppingBag size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-900 text-lg">I'm a Shopper</h4>
                                    <p className="text-sm text-slate-500">Scan items & checkout instantly</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                        </motion.button>

                        {/* Store Owner */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLogin('owner')}
                            className="w-full flex items-center justify-between p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-accent transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-accent-50 text-accent rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Store size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-slate-900 text-lg">I'm a Store Owner</h4>
                                    <p className="text-sm text-slate-500">Manage inventory & orders</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-accent transition-colors" />
                        </motion.button>
                    </div>

                    {/* Divider with "Continue with Google" */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400">Powered by Google OAuth</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        By continuing, you agree to SwiftCart's Terms of Service.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Landing;
