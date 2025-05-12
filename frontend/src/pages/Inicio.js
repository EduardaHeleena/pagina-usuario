import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Inicio.css";

const Inicio = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nome, setNome] = useState(user?.nome || "nome de usuário");
  const [fotoPerfil, setFotoPerfil] = useState(user?.foto_perfil);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const faturas = [
    { id: 1, texto: "Fatura de Março paga com sucesso!", icone: "💰", tempo: "15 minutos atrás" },
    { id: 2, texto: "Fatura de Abril em atraso! Evite juros.", icone: "⏳", tempo: "1 hora atrás" },
    { id: 3, texto: "Nova fatura emitida para Maio.", icone: "📄", tempo: "2 horas atrás" },
  ];

  // Função para lidar com mudanças na foto de perfil
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoFoto(file);
      setFotoPerfil(URL.createObjectURL(file)); // Mostra a foto temporariamente
    }
  };

   // Função para converter a foto para base64
   const converterParaBase64 = (foto) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(foto);
    });
  };

  // Função para salvar as alterações no perfil
  const salvarPerfil = async () => {
    const formData = {
      id: user.id,
      nome,
      foto: arquivoFoto ? await converterParaBase64(arquivoFoto) : null
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Erro ao atualizar perfil.");
      const result = await response.json();
  
      // Atualiza o estado do usuário com as novas informações
      setUser(prevUser => ({
        ...prevUser,
        nome,
        foto_perfil: result.foto_perfil || prevUser.foto_perfil
      }));
  
      localStorage.setItem("user", JSON.stringify(user));
      setMostrarModal(false); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  // Usado para carregar a imagem do perfil
  useEffect(() => {
    if (user?.foto_perfil) {
      setFotoPerfil(user.foto_perfil);
    }
  }, [user]);

  return (
    <div className="pagina-inicio">
      <div className="menu-inicio">
        <ul>
          <li onClick={() => navigate("/inicio")}>🏠 Início</li>
          <li onClick={() => navigate(`/faturas-pagas/${user?.id}`)}>💰 Faturas Pagas</li>
          <li onClick={() => navigate(`/faturas-abertas/${user?.id}`)}>📄 Faturas à Vencer</li>
          <li onClick={() => navigate(`/faturas-atraso/${user?.id}`)}>⏳ Faturas em Atraso</li>
          <li onClick={() => navigate("/nota-fiscal")}>🧾 Notas Fiscais</li>
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