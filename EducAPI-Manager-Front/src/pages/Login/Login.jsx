import React, { useState } from 'react'
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom";
import "./Login.css"

import AuthLayout from '../../layouts/LayoutInitial/AuthLayout';
const Login = () => {

  const [form, setform] = useState({
    email: "",
    senha: ""

  });

  const handleSubmit = () => {

  }
  const handleChange = () => {

  }


  return (
    <AuthLayout
      title="Faça Login"
      text="Acesse sua conta para continuar">
      <form className='form-content' onSubmit={(e) => e.preventDefault()}>

        <Input
          label='Email'
          type='email'
          id='email'
          name='email'
        />

        <Input
          label='Senha'
          type='password'
          id='senha'
          name='senha'
        />

        <p className='text-login'>
          Esqueceu a sua senha?{" "}
          <Link to="/redefinir-senha" className='link-login'>
            Clique aqui
          </Link>
        </p>

        <Button className='button-login'
          type='submit'
          children='Entrar'
        />


      </form>
      <hr />

      <p className='text-login' style={{ textAlign: "center" }}>
        Não tem uma conta?{" "}
        <Link to="/cadastrar" className='link-login'>
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>





  )
}

export default Login
