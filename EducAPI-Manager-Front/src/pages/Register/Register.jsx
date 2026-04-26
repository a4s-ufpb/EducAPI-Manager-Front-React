import React from 'react'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input"
import "./Register.css"
const Register = () => {

  const handleSubmit = () => {

  }

  const handleChange = () => {

  }
  return (
    <AuthLayout
      title="Cadastre-se"
      text="Cadastre-se para começar a usar o serviço">

      <form className='form-content'  onSubmit={handleSubmit}>

        <Input
          id="nome"
          name="nome"
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          
        />

        <Input
          id='email'
          name="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          
        />

        <Input
          id="senha"
          name="senha"
          label="Senha"
          type="password"
          placeholder="********"
        />

        <Input
          id="confirmarSenha"
          name="confirmarSenha"
          label="Confirmar senha"
          type="password"
          placeholder="********"
        />

        <Button className='button'
          type='submit'
          children='Cadastrar'
        />


      </form>
      <hr />

      <p className='text' style={{ textAlign: "center" }}>
        Já tem uma Conta?{" "}
        <Link to="/" className='link'>
           Faça o login
        </Link>
      </p>

    </AuthLayout>
  )
}

export default Register
