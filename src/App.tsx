import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, TrendingUp, BookOpen, Users, User } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Progress from './screens/Progress';
import Learn from './screens/Learn';
import Community from './screens/Community';
import Profile from './screens/Profile';

function Navigation() {
  const location = useLocation();
  const hideNav = ['/', '/onboarding'].includes(location.pathname);

  if (hideNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 max-w-md mx-auto">
      <NavItem to="/home" icon={<HomeIcon size={20} />} label="Home" />
      <NavItem to="/progress" icon={<TrendingUp size={20} />} label="Stats" />
      <NavItem to="/learn" icon={<BookOpen size={20} />} label="Learn" />
      <NavItem to="/community" icon={<Users size={20} />} label="Cohort" />
      <NavItem to="/profile" icon={<User size={20} />} label="Me" />
    </nav>
  );
}

function NavItem({ to, icon, label }: any) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#0D7377]' : 'text-gray-400'}`}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </NavLink>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <div className="bg-white min-h-screen max-w-md mx-auto relative shadow-2xl">
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <Navigation />
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}
