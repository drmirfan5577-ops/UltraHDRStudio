import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudioApp from '@/pages/StudioApp';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050814]">
      <div className="text-center glass-panel p-10 rounded-2xl">
        <div className="font-display text-6xl font-black text-purple-400 glow-text-purple mb-4">404</div>
        <p className="text-white/60 mb-6">Page not found</p>
        <a href="/" className="btn-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm inline-block">Go to Studio</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudioApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
