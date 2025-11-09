import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {toast, ToastContainer} from "react-toastify";
import Navigation from "./Navigation";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, pass);
      toast.success("Account created. Check your e-mail for activation link.", { position: "bottom-center" });
    } catch (e: any) {
      toast.error("Registration failed! Try again later!", {
        position: "bottom-center",
      });
    }
  }

  return (
    <div>
      <Navigation />
      <form onSubmit={onSubmit} style={{display: "grid", gap: 8, maxWidth: 360}}>
        <h2>Register</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name"/>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
        <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password"/>
        <button type="submit">Create account</button>
      </form>
      <ToastContainer />
    </div>

  );
}
