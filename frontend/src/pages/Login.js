import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos.");
      }

      const userData = await response.json();
      login(userData); 
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Sign in</h2>

        <button type="button" className="google-login">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            width="16"
          />
          Sign in with Google
        </button>

        <input
          type="email"
          placeholder="teste@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <div className="forgot">
          <a href="#">Forgot Password?</a>
        </div>

        {erro && <p style={{ color: "red", fontSize: "13px" }}>{erro}</p>}

        <button type="submit" className="btn-login">
          Sign in
        </button>

        <div className="signup">
          No account? <a href="#">Sign up</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
