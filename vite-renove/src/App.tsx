import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import PaginaInicial from "./paginas/Inicial"
import Funcionarios from "./paginas/Funcionarios"
import Nav from "./componentes/Nav"
import Vendas from "./paginas/Vendas"
import Produtos from "./paginas/Produtos"
import Categorias from "./paginas/Categorias"

function App() {

  return (
    <>
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route index element={<PaginaInicial />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/roupas" element={<Produtos />} />
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
