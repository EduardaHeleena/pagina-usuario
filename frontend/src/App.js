import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import FaturasPagas from "./pages/FaturasPagas";
import FaturasAbertas from "./pages/FaturasAbertas";
import FaturasAtraso from "./pages/FaturasAtraso";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/faturas-pagas/:clienteId" element={<FaturasPagas />} />
        <Route path="/faturas-abertas/:clienteId" element={<FaturasAbertas />} />
        <Route path="/faturas-atraso/:clienteId" element={<FaturasAtraso />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;