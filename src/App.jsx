import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import IcedataNavbar from './components/IcedataNavbar.jsx';
import About from './pages/About/index.jsx';
import Home from './pages/Home/index.jsx';
import Overview from './pages/Overview/index.jsx';
import NotFound from './pages/NotFound.jsx';
import UnderDevelopment from './pages/UnderDevelopment.jsx';

function AppLayout() {
  return (
    <>
      <IcedataNavbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<Overview />} />
          <Route path="videos" element={<UnderDevelopment />} />
          <Route path="vocals" element={<UnderDevelopment />} />
          <Route path="producers" element={<UnderDevelopment />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
