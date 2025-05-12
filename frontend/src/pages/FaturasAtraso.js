import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MenuLateral from "../components/MenuLateral";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./FaturasPagas.css";

const FaturasAtraso = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [faturas, setFaturas] = useState([]);
  const [cardAtivo, setCardAtivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [limitePorPagina, setLimitePorPagina] = useState(5);
  const [totalFaturas, setTotalFaturas] = useState(0);

  const buscarFaturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.append("page", paginaAtual);
      query.append("limit", limitePorPagina);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/faturas-atraso/${user.id}?${query.toString()}`);
      if (!response.ok) throw new Error("Erro ao buscar faturas em atraso.");
      const data = await response.json();
      setFaturas(data.faturas);
      setTotalFaturas(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) buscarFaturas();
  }, [user, paginaAtual, limitePorPagina]);

  const toggleCard = (numeroFatura) => {
    setCardAtivo(cardAtivo === numeroFatura ? null : numeroFatura);
  };

  const totalPaginas = Math.ceil(totalFaturas / limitePorPagina);

  const exportarParaPDF = () => {
    const doc = new jsPDF();
    doc.text("Faturas em Atraso", 14, 10);
    const colunas = ["Número", "Valor", "Emissão", "Vencimento", "Juros"];
    const linhas = faturas.map(f => [
      f.numero_fatura,
      `R$ ${parseFloat(f.valor).toFixed(2)}`,
      new Date(f.data_emissao).toLocaleDateString(),
      new Date(f.data_vencimento).toLocaleDateString(),
      `R$ ${parseFloat(f.juros).toFixed(2)}`
    ]);
    autoTable(doc, { head: [colunas], body: linhas, startY: 20 });
    doc.save("faturas-atraso.pdf");
  };

  const exportarParaExcel = () => {
    const dados = faturas.map(f => ({
      "Número da Fatura": f.numero_fatura,
      "Valor (R$)": parseFloat(f.valor).toFixed(2),
      "Data de Emissão": new Date(f.data_emissao).toLocaleDateString(),
      "Data de Vencimento": new Date(f.data_vencimento).toLocaleDateString(),
      "Juros (R$)": parseFloat(f.juros).toFixed(2)
    }));
    const planilha = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, "Faturas");
    const arquivoExcel = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([arquivoExcel], { type: "application/octet-stream" });
    saveAs(blob, "faturas-atraso.xlsx");
  };

  if (loading) return <p>Carregando faturas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pagina-faturas">
      <MenuLateral aberto={menuAberto} setAberto={setMenuAberto} />
      <div className="faturas-page">
        <div className="faturas-header">
          <div className="header-esquerda">
            <button className="btn-voltar" onClick={() => navigate("/inicio")}>Voltar</button>
            <h2>Faturas em Atraso</h2>
          </div>
          <button className="btn-menu" onClick={() => setMenuAberto(!menuAberto)}>☰</button>
        </div>

        <p><strong>Total de faturas:</strong> {totalFaturas} | <strong>Total de páginas:</strong> {totalPaginas}</p>

        <div className="lista-faturas">
          {faturas.length === 0 ? (
            <p>Nenhuma fatura em atraso encontrada.</p>
          ) : (
            faturas.map((fatura) => (
              <div
                key={fatura.numero_fatura}
                className={`fatura-card ${cardAtivo === fatura.numero_fatura ? "ativo" : ""}`}
                onClick={() => toggleCard(fatura.numero_fatura)}
              >
                <div className="fatura-info">
                  <span><strong>Nº:</strong> {fatura.numero_fatura}</span>
                  <span><strong>Valor:</strong> R$ {parseFloat(fatura.valor).toFixed(2)}</span>
                </div>
                <div className="fatura-detalhes">
                  <span><strong>Emissão:</strong> {new Date(fatura.data_emissao).toLocaleDateString()}</span>
                  <span><strong>Vencimento:</strong> {new Date(fatura.data_vencimento).toLocaleDateString()}</span>
                  <span><strong>Juros:</strong> R$ {parseFloat(fatura.juros).toFixed(2)}</span>
                  <span className="status pago">Em Atraso</span>
                </div>
                {cardAtivo === fatura.numero_fatura && (
                  <div className="fatura-extra">
                    {fatura.boleto_url && <a href={fatura.boleto_url} target="_blank" rel="noreferrer" className="botao-link">Ver Boleto</a>}
                    {fatura.nota_fiscal_url && <a href={fatura.nota_fiscal_url} target="_blank" rel="noreferrer" className="botao-link">Ver Nota Fiscal</a>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(paginaAtual - 1)}>Página Anterior</button>
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(paginaAtual + 1)}>Próxima Página</button>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
          <button onClick={exportarParaPDF}>Exportar PDF</button>
          <button onClick={exportarParaExcel}>Exportar Excel</button>
        </div>
      </div>
    </div>
  );
};

export default FaturasAtraso;
