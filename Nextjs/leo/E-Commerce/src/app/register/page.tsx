import React from 'react';
import { AuthLayout } from '../../components/templates/AuthLayout';
import { RegisterForm } from '../../components/organisms/RegisterForm';
import { GuestRoute } from '../../components/templates/GuestRoute';

export default function RegisterPage() {
  return (
    <GuestRoute>
      <AuthLayout 
        title="Crea tu cuenta" 
        subtitle="Únete a nuestra plataforma de e-commerce"
      >
        <RegisterForm />
      </AuthLayout>
    </GuestRoute>
  );
}
