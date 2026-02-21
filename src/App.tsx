import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Add } from './pages/Add';
import { Statistics } from './pages/Statistics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
