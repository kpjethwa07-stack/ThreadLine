import Brand from "../components/Brand";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const cleanedUsername = username.trim().toLowerCase();
    const cleanedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!USERNAME_REGEX.test(cleanedUsername)) {
      setError(
        "Username must be 3-20 characters using letters, numbers, or underscores."
      );
      return;
    }

    if (!EMAIL_REGEX.test(cleanedEmail)) {
      setError(
        "Please enter a valid email address (for example, name@example.com)."
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(trimmedName, cleanedUsername, cleanedEmail, password);
      navigate("/login", {
        state: { registered: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-register-page">
      <div className="auth-background" />
      <div className="auth-brand">
        <Brand />
      </div>

      <main className="auth-main">
        <section className="auth-intro">
          <span className="auth-eyebrow">A clearer way to work</span>
          <h1>
            Start building <br /> with <span>clarity.</span>
          </h1>
          <p>
            Create your workspace, organize projects, and track everything that
            needs to get done.
          </p>
        </section>

        <section className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-kicker">GET STARTED</span>
            <h2>Create account</h2>
            <p className="auth-subtitle">
              Get started with your personal workspace.
            </p>
          </div>

          {error && <div className="auth-alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                type="text"
                autoComplete="username"
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]{3,20}"
                title="3-20 characters using letters, numbers, or underscores"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
                title="Enter a valid email address like name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="auth-field-hint">Use at least 6 characters.</span>
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">Confirm password</label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              <span>
                {loading ? "Creating account..." : "Create account"}
              </span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </section>
      </main>
    </div>
  );
}