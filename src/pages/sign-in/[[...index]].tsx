import { SignIn } from "@clerk/nextjs";
import { MockSignIn } from "../../components/auth/MockProviders";

// Проверка, включен ли мок-режим
const isMockMode = process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true';

export default function SignInPage() {
  // В мок-режиме используем мок-компонент входа
  if (isMockMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Вход в аккаунт (Тестовый режим)
          </h1>
          <MockSignIn />
        </div>
      </div>
    );
  }

  // Стандартный рендер с Clerk
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Вход в аккаунт
        </h1>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            },
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
} 