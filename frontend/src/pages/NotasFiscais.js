import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MenuLateral from "../components/MenuLateral";
import "./FaturasPagas.css";

const NotasFiscais = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [notas, setNotas] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mesSelecionado, setMesSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [limitePorPagina, setLimitePorPagina] = useState(5);
  const [totalNotas, setTotalNotas] = useState(0);

  const meses = [
    { value: "", label: "Todos os meses" },
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];
  const anos = ["", 2023, 2024, 2025];

  const buscarNotasFiscais = async () => {
    try {
      setLoading(true);
      setErro(null);

      const query = new URLSearchParams();
      if (mesSelecionado) query.append("mes", mesSelecionado);
      if (anoSelecionado) query.append("ano", anoSelecionado);
      query.append("page", paginaAtual);
      query.append("limit", limitePorPagina);

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/nota-fiscal?${query.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotas(data);
        setTotalNotas(data.length); // ajuste se backend retornar total separadamente
      } else {
        setErro("Erro ao carregar notas fiscais.");
      }
    } catch (error) {
      console.error("Erro ao buscar notas fiscais:", error);
      setErro("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarNotasFiscais();
  }, [paginaAtual, limitePorPagina]);

  const aplicarFiltro = () => {
    setPaginaAtual(1);
    buscarNotasFiscais();
  };

  const totalPaginas = Math.ceil(totalNotas / limitePorPagina);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Notas Fiscais", 14, 10);
    const colunas = ["Numero NF", "Valor", "Data de Emissão"];
    const linhas = notas.map(n => [
      n.id,
      `R$ ${parseFloat(n.valor_servico).toFixed(2)}`,
      new Date(n.data_emissao_completa).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false
      }).replace(",", " -")
    ]);
    autoTable(doc, { head: [colunas], body: linhas, startY: 20 });
    doc.save("notas-fiscais.pdf");
  };

  const exportarExcel = () => {
    const dados = notas.map(n => ({
      "ID da Nota": n.id,
      "Valor (R$)": parseFloat(n.valor_servico).toFixed(2),
      "Data de Emissão": new Date(n.data_emissao_completa).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false
      }).replace(",", " -")
    }));
    const planilha = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, planilha, "Notas Fiscais");
    const arquivoExcel = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([arquivoExcel], { type: "application/octet-stream" });
    saveAs(blob, "notas-fiscais.xlsx");
  };

  return (
    <div className="pagina-faturas">
      <MenuLateral aberto={menuAberto} setAberto={setMenuAberto} />
      <div className="faturas-page">
        <div className="faturas-header">
          <div className="header-esquerda">
            <button className="btn-voltar" onClick={() => navigate("/inicio")}>Voltar</button>
            <h2>Notas Fiscais</h2>
          </div>
          <button className="btn-menu" onClick={() => setMenuAberto(!menuAberto)}>☰</button>
        </div>

        {/* Filtros */}
        <div className="filtros-faturas">
          <select value={mesSelecionado} onChange={(e) => setMesSelecionado(e.target.value)}>
            {meses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(e.target.value)}>
            {anos.map(a => <option key={a} value={a}>{a === "" ? "Todos os anos" : a}</option>)}
          </select>
          <select value={limitePorPagina} onChange={(e) => setLimitePorPagina(Number(e.target.value))}>
            {[5, 10, 15, 20].map(l => <option key={l} value={l}>{l} por página</option>)}
          </select>
          <button onClick={aplicarFiltro}>Filtrar</button>
        </div>

        <p><strong>Total de notas:</strong> {totalNotas} | <strong>Total de páginas:</strong> {totalPaginas}</p>

        {erro ? <p>{erro}</p> : loading ? <p>Carregando...</p> : (
          <div className="lista-faturas">
            {notas.length === 0 ? (
              <p>Nenhuma nota fiscal encontrada.</p>
            ) : (
              notas.map(nota => (
                <div key={nota.id} className="fatura-card">
                  <div className="fatura-info">
                    <span><strong>Fautra NF:</strong> {nota.invoice_number}</span>
                    <span><strong>Valor:</strong> R$ {parseFloat(nota.valor_servico).toFixed(2)}</span>
                    <span><strong>Data de Emissão:</strong> {
                      new Date(nota.data_emissao_completa).toLocaleString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit", hour12: false
                      }).replace(",", " -")
                    }</span>
                  </div>
                  <div className="fatura-extra">
                    <a
                      className="botao-link"
                      href={`${process.env.REACT_APP_BACKEND_URL}/nota-fiscal/${nota.invoice_number}/visualizar`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visualizar Nota Fiscal
                    </a>
                    <a
                      className="botao-link"
                      href={`${process.env.REACT_APP_BACKEND_URL}/nota-fiscal/${nota.invoice_number}/download`}
                    >
                      Baixar Nota Fiscal
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="paginacao-faturas">
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(paginaAtual - 1)}>Página Anterior</button>
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(paginaAtual + 1)}>Próxima Página</button>
        </div>

        <div className="exportacao-faturas">
          <button onClick={exportarPDF}>Exportar PDF</button>
          <button onClick={exportarExcel}>Exportar Excel</button>
        </div>
      </div>
    </div>
  );
};

export default NotasFiscais;
