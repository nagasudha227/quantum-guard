import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { RiskAssessment } from './pages/RiskAssessment';
import { MigrationAdvisor } from './pages/MigrationAdvisor';
import { CryptoLab } from './pages/CryptoLab';
import { Benchmark } from './pages/Benchmark';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/assessment" element={<RiskAssessment />} />
          <Route path="/migration" element={<MigrationAdvisor />} />
          <Route path="/lab" element={<CryptoLab />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
