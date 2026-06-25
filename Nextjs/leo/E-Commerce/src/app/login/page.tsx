import React from 'react';
import { AuthLayout } from '../../components/templates/AuthLayout';
import { LoginForm } from '../../components/organisms/LoginForm';
import { GuestRoute } from '../../components/templates/GuestRoute';

export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthLayout 
        title="Bienvenido de nuevo" 
        subtitle="Inicia sesión en tu cuenta para continuar"
      >
        <LoginForm />
      </AuthLayout>
    </GuestRoute>
  );
}
