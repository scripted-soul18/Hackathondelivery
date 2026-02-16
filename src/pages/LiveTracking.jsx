import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { icon } from 'leaflet';
import { Package, Clock, CheckCircle2, Truck, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue
const deliveryIcon = icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const STATUSES = [
    { key: 'preparing', label: 'Preparing Order', icon: Package, duration: 4000 },
    { key: 'picked_up', label: 'Picked Up', icon: Truck, duration: 5000 },
    { key: 'on_the_way', label: 'On the Way', icon: MapPin, duration: 10000 },
    { key: 'delivered', label: 'Delivered!', icon: CheckCircle2, duration: 0 },
];

const LiveTracking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { shop, cartItems = [], totalPrice = 0 } = location.state || {};

    const [statusIndex, setStatusIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [markerPos, setMarkerPos] = useState(shop?.location || [51.505, -0.09]);

    const userLocation = [51.50, -0.08]; // Fixed user location
    const shopLocation = shop?.location || [51.505, -0.09];

    // Simulate status progression
    useEffect(() => {
        if (statusIndex >= STATUSES.length - 1) return;
        const timer = setTimeout(() => {
            setStatusIndex(prev => prev + 1);
        }, STATUSES[statusIndex].duration);
        return () => clearTimeout(timer);
    }, [statusIndex]);

    // Simulate marker movement when on the way
    useEffect(() => {
        if (STATUSES[statusIndex].key !== 'on_the_way') return;

        const duration = STATUSES[statusIndex].duration;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const p = Math.min(elapsed / duration, 1);
            setProgress(p);

            const lat = shopLocation[0] + (userLocation[0] - shopLocation[0]) * p;
            const lng = shopLocation[1] + (userLocation[1] - shopLocation[1]) * p;
            setMarkerPos([lat, lng]);

            if (p >= 1) clearInterval(interval);
        }, 100);

        return () => clearInterval(interval);
    }, [statusIndex]);

    const currentStatus = STATUSES[statusIndex];

    if (!shop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">No active delivery</p>
                    <button onClick={() => navigate('/delivery')} className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold">
                        Order Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Map */}
            <div className="relative h-[50vh] min-h-[300px]">
                <MapContainer
                    center={[
                        (shopLocation[0] + userLocation[0]) / 2,
                        (shopLocation[1] + userLocation[1]) / 2
                    ]}
                    zoom={14}
                    className="h-full w-full z-0"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Route line */}
                    <Polyline
                        positions={[shopLocation, userLocation]}
                        pathOptions={{ color: '#8b5cf6', weight: 4, dashArray: '10 6', opacity: 0.5 }}
                    />
                    {/* Shop marker */}
                    <Marker position={shopLocation} icon={deliveryIcon}>
                        <Popup>{shop.name}</Popup>
                    </Marker>
                    {/* User marker */}
                    <Marker position={userLocation} icon={deliveryIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                    {/* Moving delivery marker */}
                    {STATUSES[statusIndex].key === 'on_the_way' && (
                        <Marker position={markerPos} icon={deliveryIcon}>
                            <Popup>🚚 Your Delivery</Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* ETA overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-secondary" />
                        <span className="text-sm font-semibold text-slate-900">
                            {currentStatus.key === 'delivered' ? 'Delivered!' : shop.eta}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Panel */}
            <div className="flex-1 bg-white rounded-t-3xl -mt-4 relative z-10 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {/* Progress bar */}
                <div className="flex gap-1.5 mb-6">
                    {STATUSES.map((s, i) => (
                        <div key={s.key} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: i < statusIndex ? '100%' : i === statusIndex ? `${progress * 100}%` : '0%' }}
                                className="h-full bg-secondary rounded-full"
                            />
                        </div>
                    ))}
                </div>

                {/* Current status */}
                <div className="flex items-center gap-4 mb-6">
                    <motion.div
                        animate={currentStatus.key !== 'delivered' ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: currentStatus.key !== 'delivered' ? Infinity : 0 }}
                        className={`p-4 rounded-2xl ${currentStatus.key === 'delivered' ? 'bg-primary/10' : 'bg-secondary/10'}`}
                    >
                        <currentStatus.icon size={28} className={currentStatus.key === 'delivered' ? 'text-primary' : 'text-secondary'} />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{currentStatus.label}</h2>
                        <p className="text-sm text-slate-500">
                            {currentStatus.key === 'preparing' && 'Your order is being prepared'}
                            {currentStatus.key === 'picked_up' && 'Rider has picked up your order'}
                            {currentStatus.key === 'on_the_way' && 'Your order is on its way'}
                            {currentStatus.key === 'delivered' && 'Your order has been delivered'}
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-0">
                    {STATUSES.map((s, i) => {
                        const StatusIcon = s.icon;
                        const isDone = i <= statusIndex;
                        return (
                            <div key={s.key} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDone ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <StatusIcon size={14} />
                                    </div>
                                    {i < STATUSES.length - 1 && (
                                        <div className={`w-0.5 h-8 ${isDone ? 'bg-secondary' : 'bg-slate-100'}`} />
                                    )}
                                </div>
                                <div className="pt-1">
                                    <p className={`text-sm font-medium ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order info */}
                <div className="mt-6 bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Order from</span>
                        <span className="font-semibold text-slate-900">{shop.name}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-slate-500">Items</span>
                        <span className="font-semibold text-slate-900">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-slate-500">Total</span>
                        <span className="font-bold text-secondary">₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {currentStatus.key === 'delivered' && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/')}
                        className="w-full mt-4 py-4 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/30"
                    >
                        Done — Back to Home
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default LiveTracking;
