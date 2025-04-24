import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Inicio.css";

const Inicio = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nome, setNome] = useState(user?.nome || "nome de usuário");
  const [fotoPerfil, setFotoPerfil] = useState(user?.foto_perfil ? `${process.env.REACT_APP_FILE_URL}/${user.foto_perfil}` : null);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const faturas = [
    { id: 1, texto: "Fatura de Março paga com sucesso!", icone: "💰", tempo: "15 minutos atrás" },
    { id: 2, texto: "Fatura de Abril em atraso! Evite juros.", icone: "⏳", tempo: "1 hora atrás" },
    { id: 3, texto: "Nova fatura emitida para Maio.", icone: "📄", tempo: "2 horas atrás" },
  ];

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoFoto(file);
      setFotoPerfil(URL.createObjectURL(file));
    }
  };

  const salvarPerfil = async () => {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("nome", nome);
    if (arquivoFoto) formData.append("foto", arquivoFoto);

    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/usuario/perfil`, {
        method: "PUT",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao atualizar perfil.");
      const result = await response.json();

      const novoUsuario = {
        ...user,
        nome: nome,
        foto_perfil: result.foto_perfil || user.foto_perfil
      };
      setUser(novoUsuario);
      localStorage.setItem("user", JSON.stringify(novoUsuario));
      if (result.foto_perfil) {
        setFotoPerfil(`${process.env.REACT_APP_FILE_URL}/${result.foto_perfil}`);
      }

      setMostrarModal(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  return (
    <div className="pagina-inicio">
      <div className="menu-inicio">
        <ul>
          <li onClick={() => navigate("/inicio")}>🏠 Início</li>
          <li onClick={() => navigate(`/faturas-pagas/${user?.id}`)}>💰 Faturas Pagas</li>
          <li onClick={() => navigate(`/faturas-abertas/${user?.id}`)}>📄 Faturas à Vencer</li>
          <li onClick={() => navigate(`/faturas-atraso/${user?.id}`)}>⏳ Faturas em Atraso</li>
          <li>🧾 Notas Fiscais</li>
          <li>⚙️ Configurações</li>
          <li><button onClick={logout} className="btn-sair">🚪 Sair</button></li>
        </ul>
      </div>

      <div className="conteudo-inicio">
        <div className="perfil">
          <div className="perfil-info" style={{ display: "flex", alignItems: "center" }}>
            {fotoPerfil && <img src={fotoPerfil} alt="Foto de Perfil" className="foto-perfil" />}
            <div>
              <h2>{nome}</h2>
              <span>@{nome.toLowerCase().replaceAll(" ", "_")}</span>
            </div>
          </div>
          <button onClick={() => setMostrarModal(true)}>Editar Perfil</button>
        </div>

        <div className="ultimas-faturas">
          <h3>Últimas Faturas</h3>
          {faturas.map((fatura) => (
            <div key={fatura.id} className="fatura-card">
              <span>{fatura.icone} {fatura.texto}</span>
              <span>{fatura.tempo}</span>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-perfil">
          <div className="modal-conteudo">
            <h3>Editar Perfil</h3>
            <label>Nome:</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Foto de Perfil:</label>
            <input type="file" accept="image/*" onChange={handleFotoChange} />

            <div className="modal-botoes">
              <button onClick={salvarPerfil}>Salvar</button>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;
