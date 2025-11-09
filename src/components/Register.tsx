import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {toast, ToastContainer} from "react-toastify";
import Navigation from "./Navigation";
import "./LogRegForm.css";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passTest, setPassTest] = useState(true);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, pass);
      toast.success("Account created. Check your e-mail for activation link.", { position: "bottom-center" });
    } catch (e: any) {
      let data;

      const msg = e.message;

      try {
        data = JSON.parse(msg);
      } catch {
        data = { error: "unknown", ok: false };
      }

      if (data.error === "email_in_use" && !data.ok) {
        toast.error("Registration failed! E-mail in use!", {
          position: "bottom-center",
        });
        return;
      }
      toast.error("Registration failed! Try again later!", {
        position: "bottom-center",
      });
    }
  }

  return (
    <div>
      <Navigation />
      <div className="form-wrapper">
        <form onSubmit={onSubmit}>
          <h2>Register</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" required/>
          <input value={email} type='email'  onChange={(e) => setEmail(e.target.value)} placeholder="email" required/>
          <input value={pass} onChange={(e) => {
            let pass = e.target.value;
            const reg = /^(?=.*\d)(?=.*[^\w\s]).{8,}$/;
            const test = reg.test(pass);
            if (test) {
              setPass(e.target.value);
              setPassTest(true);
            }else{
              setPass(e.target.value);
              setPassTest(false);
            }
          }} placeholder="password" type="password" required/>
          {!passTest && <p>Minimum 8 characters, including at least one number and one special character</p>}
          <button type="submit">Create account</button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}
