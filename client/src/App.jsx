import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Response from "./pages/Response";
import { ResponseProvider } from "./context/responseContext";
("react-router-dom");

function App() {
  return (
    <div className="bg-black w-screen h-screen">
      <ResponseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/response" element={<Response />} />
          </Routes>
        </BrowserRouter>
      </ResponseProvider>
    </div>
  );
}

export default App;
