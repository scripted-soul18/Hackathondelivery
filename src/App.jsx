import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import StoreEntry from './pages/StoreEntry';
import ScanAndGo from './pages/ScanAndGo';
import DirectDelivery from './pages/DirectDelivery';
import Checkout from './pages/Checkout';
import LiveTracking from './pages/LiveTracking';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/store-entry" element={<StoreEntry />} />
          <Route path="/scan" element={<ScanAndGo />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/delivery" element={<DirectDelivery />} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
