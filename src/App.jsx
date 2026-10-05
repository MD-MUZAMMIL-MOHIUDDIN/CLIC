import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReferenceProvider } from './context/ReferenceContext';
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
import InputStorePortal from './pages/InputStorePortal';
import LivestockPortal from './pages/LivestockPortal';
import AdminPortal from './pages/AdminPortal';
import ManageHub from './pages/ManageHub';
import DiseaseWorkflow from './pages/DiseaseWorkflow';
import FarmerServices from './pages/FarmerServices';
import DataUploadHub from './pages/DataUploadHub';

export default function App() {
  return (
    <AuthProvider>
      <ReferenceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="admin" element={<AdminPortal />} />
              <Route path="manage" element={<ManageHub />} />
              <Route path="crops" element={<Advisory />} />
              <Route path="livestock" element={<Advisory />} />
              <Route path="fisheries" element={<Advisory />} />
              <Route path="data-upload" element={<DataUploadHub />} />
              <Route path="upload-data" element={<DataUploadHub />} />
              <Route path="farmer-services" element={<FarmerServices />} />
              <Route path="farmer-portal" element={<FarmerServices />} />
              <Route path="machinery" element={<DiseaseWorkflow />} />
              <Route path="farm-machinery" element={<DiseaseWorkflow />} />
              <Route path="disease-workflow" element={<DiseaseWorkflow />} />
              <Route path="walkin-diagnosis" element={<DiseaseWorkflow />} />
              <Route path="chc-portal" element={<CHCPortal />} />
              <Route path="fmc-portal" element={<FMCPortal />} />
              <Route path="input-store-portal" element={<InputStorePortal />} />
              <Route path="livestock-portal" element={<LivestockPortal />} />
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
      </ReferenceProvider>
    </AuthProvider>
  );
}



