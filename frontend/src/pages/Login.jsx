import Brand from "../components/Brand";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-login-page">
      <div className="auth-background" />

     <div className="auth-brand">
  <Brand />
</div>

      <main className="auth-main">
        <section className="auth-intro">
          <div className="auth-eyebrow">
            Your work, connected
          </div>

          <h1>
            Bring your
            <br />
            work <span>together.</span>
          </h1>

          <p>
            A clearer space for issues, updates and team
            conversations. Everything your team needs to keep
            moving, in one place.
          </p>
        </section>

        <section className="auth-card">
          <div className="auth-card-heading">
            <h2>Welcome back.</h2>
            <p className="auth-subtitle">
              Sign in to access your ThreadLine workspace.
            </p>
          </div>

          {error && (
            <div className="auth-alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="auth-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-switch">
            New to ThreadLine?
            <Link to="/register">Create an account</Link>
          </div>
        </section>
      </main>

      <div className="auth-page-footer">
        © 2026 ThreadLine
      </div>
    </div>
  );
}
