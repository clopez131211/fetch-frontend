import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface FormData {
  name: string;
  email: string;
}

function LoginPage(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [error, setError] = useState<string>("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.name, formData.email);
      navigate("/search");
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} data-testid="login-form">
        <h1>Login</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
