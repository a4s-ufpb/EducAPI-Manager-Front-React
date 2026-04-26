import React, { useState } from 'react'
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"

import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
const Login = () => {

  const [form, setform] = useState({
    email: "",
    senha: ""

  });
   const navigate = useNavigate();

  const handleSubmit = (e) => {
     e.preventDefault()
     navigate("/home")

  }
  const handleChange = () => {

  }


  return (
    <AuthLayout
      title="Faça Login"
      text="Acesse sua conta para continuar">
      <form className='form-content' onSubmit={handleSubmit}>
        <Input
          id='email'
          name="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          id='senha'
          name="senha"
          label="Senha"
          type="password"
          placeholder="********"
          value={form.senha}
          onChange={handleChange}
        />

        <p className='text'>
          Esqueceu a sua senha?{" "}
          <Link to="/redefinir-senha" className='link'>
            Clique aqui
          </Link>
        </p>

        <Button className='button'
          type='submit'
          children='Entrar'
        />


      </form>
      <hr />

      <p className='text' style={{ textAlign: "center" }}>
        Não tem uma conta?{" "}
        <Link to="/cadastrar" className='link'>
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>





  )
}

export default Login
