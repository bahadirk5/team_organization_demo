import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeamManagement from "./pages/team-management";
import Diagram from "./pages/diagram";
import Charts from "./pages/charts";
import { Navbar } from "./components/navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<TeamManagement />} />
              <Route path="/diagram" element={<Diagram />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
