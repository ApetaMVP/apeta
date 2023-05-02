import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useRouteData } from '@remix-run/react';

interface ResetPasswordData {
  email: string;
}

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useRouteData<ResetPasswordData>();

  async function handleResetPassword() {
    setIsLoading(true);

    // Here you would make an API call to initiate the password reset process
    // using the email entered by the user.

    setIsLoading(false);
  }

  return (
    <>
      <h1>Reset Password</h1>
      <p>Enter your email address below and we'll send you instructions on how to reset your password.</p>
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        disabled={isLoading}
      />
      <Button onClick={handleResetPassword} loading={isLoading}>
        Reset Password
      </Button>
    </>
  );
}
