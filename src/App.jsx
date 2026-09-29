import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Advisory from './pages/Advisory';
import LearningHub from './pages/LearningHub';
import Market from './pages/Market';
import Schemes from './pages/Schemes';
import FacilitatorPortal from './pages/FacilitatorPortal';
import Groundwater from './pages/Groundwater';
import Locations from './pages/Locations';

import FarmMachinery from './pages/FarmMachinery';
import CHCPortal from './pages/CHCPortal';
import FMCPortal from './pages/FMCPortal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="machinery" element={<FarmMachinery />} />
            <Route path="farm-machinery" element={<FarmMachinery />} />
            <Route path="chc-portal" element={<CHCPortal />} />
            <Route path="fmc-portal" element={<FMCPortal />} />
            <Route path="weather" element={<Weather />} />
            <Route path="advisory" element={<Advisory />} />
            <Route path="groundwater" element={<Groundwater />} />
            <Route path="learning" element={<LearningHub />} />
            <Route path="market" element={<Market />} />
            <Route path="locations" element={<Locations />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="facilitator" element={<FacilitatorPortal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
