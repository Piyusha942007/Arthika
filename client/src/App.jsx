// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Welcome from "./pages/Auth/Welcome";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Welcome />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        {/* Later */}
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;