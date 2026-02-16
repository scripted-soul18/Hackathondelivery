import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar or TabBar will be injected here later */}
            <main className="pb-20"> {/* Padding bottom for mobile tab bar */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
