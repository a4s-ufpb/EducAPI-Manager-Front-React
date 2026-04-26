import React from 'react'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input"
const ResetPassword = () => {

    const handleSubmit = () => {

  }

  const handleChange = () => {

  }
  return (
    <AuthLayout
      title="Redefinir Senha"
      text="Faça uma nova senha para acessar sua conta.">

      <form className='form-content' onSubmit={handleSubmit}>

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
        Lembrou sua senha?{" "}
        <Link to="/" className='link'>
          Voltar para o Login
        </Link>
      </p>


    </AuthLayout>
  )
}

export default ResetPassword


