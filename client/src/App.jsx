
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Auth/Welcome";

import Home from "./pages/Home/Home"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;