import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart,
    ScanLine, BarChart3, AlertCircle, Clock, ArrowUpRight,
    LogOut, User, ChevronRight, Truck, RefreshCw, Store
} from 'lucide-react';
import React from 'react';

  

/* ─── Mock analytics data ─── */
const generateDailyStats = () => {
    const hourNow = new Date().getHours();
    const hoursOpen = Math.max(1, hourNow - 8); // Store opens at 8am

    const productsSold = Math.floor(80 + Math.random() * 120);
    const revenue = Math.floor(productsSold * (25 + Math.random() * 15));
    const costOfGoods = Math.floor(revenue * 0.62);
    const profit = revenue - costOfGoods;
    const exitCheckouts = Math.floor(productsSold * 0.85);
    const avgTransaction = Math.floor(revenue / exitCheckouts);

    return {
        productsSold,
        revenue,
        profit,
        costOfGoods,
        exitCheckouts,
        avgTransaction,
        hoursOpen,
        profitMargin: ((profit / revenue) * 100).toFixed(1),
    };
};

const generateHourlyData = () => {
    const hours = [];
    for (let h = 8; h <= 22; h++) {
        const label = `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`;
        const isPast = h <= new Date().getHours();
        hours.push({
            hour: label,
            sales: isPast ? Math.floor(5 + Math.random() * 25) : 0,
            isPast,
        });
    }
    return hours;
};

/* Demo product images (Unsplash direct URLs) – works in browser without require() */
const TOP_PRODUCT_IMAGES = {
    'Organic Bananas': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=200',
    'Whole Milk 1L': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=200',
    'Sourdough Bread': 'https://images.unsplash.com/photo-1549931319-a2c44724c34f?auto=format&fit=crop&w=200',
    'Eggs (Dozen)': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=200',
    'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=200',
};

const generateTopProducts = () => [
    { name: 'Organic Bananas', sold: Math.floor(30 + Math.random() * 20), revenue: 0, trend: 'up' },
    { name: 'Whole Milk 1L', sold: Math.floor(25 + Math.random() * 15), revenue: 0, trend: 'up' },
    { name: 'Sourdough Bread', sold: Math.floor(20 + Math.random() * 15), revenue: 0, trend: 'down' },
    { name: 'Eggs (Dozen)', sold: Math.floor(18 + Math.random() * 12), revenue: 0, trend: 'up' },
    { name: 'Chicken Breast', sold: Math.floor(15 + Math.random() * 10), revenue: 0, trend: 'up' },
].map(p => ({
    ...p,
    revenue: Math.floor(p.sold * (8 + Math.random() * 20)),
    image: TOP_PRODUCT_IMAGES[p.name] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200',
}));

const generateDealerOrders = () => [
    { item: 'Organic Bananas', current: 12, reorder: 50, urgency: 'high', dealer: 'FreshFarm Co.' },
    { item: 'Whole Milk 1L', current: 8, reorder: 40, urgency: 'high', dealer: 'DairyBest' },
    { item: 'Sourdough Bread', current: 25, reorder: 30, urgency: 'medium', dealer: 'ArtisanBake' },
    { item: 'Chicken Breast', current: 5, reorder: 25, urgency: 'critical', dealer: 'MeatPrime' },
    { item: 'Eggs (Dozen)', current: 15, reorder: 30, urgency: 'medium', dealer: 'FarmFresh' },
    { item: 'Olive Oil', current: 30, reorder: 20, urgency: 'low', dealer: 'MedOils' },
];

const urgencyColors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-amber-100 text-amber-700',
    medium: 'bg-blue-50 text-blue-600',
    low: 'bg-slate-50 text-slate-500',
};

/* ─── Mini bar chart component ─── */
const MiniBarChart = ({ data }) => {
    const maxSales = Math.max(...data.map(d => d.sales), 1);
    return (
        <div className="flex items-end gap-[3px] h-28">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.sales / maxSales) * 100}%` }}
                        transition={{ delay: i * 0.04, duration: 0.5 }}
                        className={`w-full rounded-t-sm min-h-[2px] ${d.isPast
                                ? d.sales > maxSales * 0.7 ? 'bg-primary' : 'bg-primary/40'
                                : 'bg-slate-100'
                            }`}
                    />
                    <span className="text-[7px] text-slate-400 -rotate-45 origin-top-left whitespace-nowrap">{d.hour}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── Donut chart (CSS only) ─── */
const DonutChart = ({ value, max, label, color }) => {
    const pct = (value / max) * 100;
    return (
        <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <motion.circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 100' }}
                    animate={{ strokeDasharray: `${pct} ${100 - pct}` }}
                    transition={{ duration: 1, delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-900">{pct.toFixed(0)}%</span>
                <span className="text-[8px] text-slate-400">{label}</span>
            </div>
        </div>
    );
};

const OwnerDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(generateDailyStats());
    const [hourlyData] = useState(generateHourlyData());
    const [topProducts] = useState(generateTopProducts());
    const [dealerOrders] = useState(generateDealerOrders());
    const [refreshing, setRefreshing] = useState(false);

    const storeName = JSON.parse(localStorage.getItem('currentStore') || '{}').name || 'SwiftCart Downtown';
    const displayName = user?.user_metadata?.full_name || user?.email || 'Store Owner';

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setStats(generateDailyStats());
            setRefreshing(false);
        }, 800);
    };

    /* Auto-refresh every 30 seconds */
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(generateDailyStats());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const criticalOrders = dealerOrders.filter(o => o.urgency === 'critical' || o.urgency === 'high');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* ─── Nav ─── */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100/50 sticky top-0 z-20 px-4 py-3">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{storeName}</h1>
                            <p className="text-[10px] text-slate-400">Owner Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleRefresh} className="p-2 hover:bg-slate-50 rounded-xl transition-colors" title="Refresh">
                            <RefreshCw size={16} className={`text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => { signOut(); window.location.reload(); }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-4 space-y-4 pb-8">
                {/* ─── Greeting ─── */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Today's Overview</p>
                    <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Hi, {displayName}! 📊</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{stats.hoursOpen}h since open
                    </p>
                </motion.div>

                {/* ─── Key Metrics Grid ─── */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            icon: Package, label: 'Products Sold', value: stats.productsSold,
                            sub: `+${Math.floor(stats.productsSold * 0.12)} from yesterday`,
                            color: 'from-primary to-emerald-500', iconBg: 'bg-primary/10 text-primary', trend: 'up'
                        },
                        {
                            icon: DollarSign, label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`,
                            sub: `Avg ₹${stats.avgTransaction}/txn`,
                            color: 'from-blue-500 to-indigo-500', iconBg: 'bg-blue-50 text-blue-500', trend: 'up'
                        },
                        {
                            icon: TrendingUp, label: 'Profit', value: `₹${stats.profit.toLocaleString()}`,
                            sub: `${stats.profitMargin}% margin`,
                            color: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-50 text-amber-500', trend: 'up'
                        },
                        {
                            icon: ScanLine, label: 'Exit Checkouts', value: stats.exitCheckouts,
                            sub: `${((stats.exitCheckouts / stats.productsSold) * 100).toFixed(0)}% scan rate`,
                            color: 'from-secondary to-purple-600', iconBg: 'bg-secondary/10 text-secondary', trend: 'up'
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="bg-white rounded-2xl p-4 shadow-card border border-slate-100/50 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-xl ${card.iconBg}`}>
                                    <card.icon size={16} />
                                </div>
                                <div className="flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                                    <ArrowUpRight size={10} /> 12%
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{card.label}</p>
                            <p className="text-[9px] text-slate-400 mt-1">{card.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ─── Hourly Sales Chart ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/50"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Hourly Sales</h3>
                            <p className="text-[10px] text-slate-400">Products scanned per hour today</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary bg-primary-50 px-2 py-1 rounded-full font-medium">
                            <BarChart3 size={12} /> Live
                        </div>
                    </div>
                    <MiniBarChart data={hourlyData} />
                </motion.div>

                {/* ─── Performance Rings ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/50"
                >
                    <h3 className="font-bold text-slate-900 text-sm mb-4">Performance</h3>
                    <div className="flex justify-around items-center">
                        <DonutChart value={stats.exitCheckouts} max={stats.productsSold} label="Scan Rate" color="#10b981" />
                        <DonutChart value={stats.profit} max={stats.revenue} label="Margin" color="#8b5cf6" />
                        <DonutChart value={Math.min(stats.productsSold, 200)} max={200} label="Daily Goal" color="#f59e0b" />
                    </div>
                </motion.div>

                {/* ─── Top Products ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/50"
                >
                    <h3 className="font-bold text-slate-900 text-sm mb-3">Top Selling Products</h3>
                    <div className="space-y-2.5">
                        {topProducts.map((p, i) => (
                            <div key={p.name} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }}
                                            transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                                            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-slate-700">{p.sold} sold</p>
                                    <p className="text-[10px] text-slate-400">₹{p.revenue}</p>
                                </div>
                                {p.trend === 'up' ? (
                                    <TrendingUp size={12} className="text-primary shrink-0" />
                                ) : (
                                    <TrendingDown size={12} className="text-red-400 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ─── Dealer Reorder Alerts ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/50"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Dealer Reorder List</h3>
                            <p className="text-[10px] text-slate-400">Items below restock threshold</p>
                        </div>
                        {criticalOrders.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                <AlertCircle size={10} /> {criticalOrders.length} urgent
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        {dealerOrders.map((order, i) => (
                            <motion.div
                                key={order.item}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.06 }}
                                className={`flex items-center justify-between p-3 rounded-xl border ${order.urgency === 'critical' ? 'border-red-200 bg-red-50/50' : 'border-slate-100 bg-slate-50/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${urgencyColors[order.urgency]}`}>
                                        {order.urgency}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{order.item}</p>
                                        <p className="text-[10px] text-slate-400">{order.dealer}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-slate-900">{order.current} left</p>
                                    <p className="text-[10px] text-slate-400">Order {order.reorder}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ─── Exit Scanner Stats ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <ScanLine size={18} className="text-primary-400" />
                            <h3 className="font-bold text-sm">Exit Scanner Summary</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-2xl font-bold">{stats.exitCheckouts}</p>
                                <p className="text-[10px] text-slate-400">Total Scans</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary-400">
                                    {((stats.exitCheckouts / stats.productsSold) * 100).toFixed(0)}%
                                </p>
                                <p className="text-[10px] text-slate-400">Verified</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-400">
                                    {Math.floor(stats.productsSold - stats.exitCheckouts)}
                                </p>
                                <p className="text-[10px] text-slate-400">Flagged</p>
                            </div>
                        </div>
                        <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> Auto-refreshes every 30s
                        </div>
                    </div>
                </motion.div>

                {/* ─── Quick summary ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 text-center"
                >
                    <p className="text-sm font-semibold text-amber-800">
                        💰 Today's Net Profit: <span className="text-lg">₹{stats.profit.toLocaleString()}</span>
                    </p>
                    <p className="text-[10px] text-amber-600 mt-1">
                        {stats.productsSold} products sold · {stats.exitCheckouts} verified checkouts · {stats.profitMargin}% margin
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
