import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { User, Lock, Sun, Moon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ResponseData } from '@/interfaces/response-data.interface';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDarkMode(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL;

      const response = await axios.post<{ token: string; rol: string }>(
        `${apiUrl}/auth/login`,
        {
          nombreusuario: username,
          contrasena: password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.rol);
        navigate('/home');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const { status, message } = axiosError.response.data as ResponseData;

          if (status === 404) {
            setErrorMessage(message);
          } else if (status === 400) {
            setErrorMessage(message);
          } else {
            setErrorMessage(
              'Ha ocurrido un error inesperado. Inténtelo de nuevo.'
            );
          }

          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        } else {
          setErrorMessage('No se pudo conectar con el servidor.');
        }
      } else {
        setErrorMessage('Error desconocido.');
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-orange-50'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-orange-500"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Cambiar tema</span>
      </Button>
      <Card
        className={`w-full max-w-md transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
      >
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="text-white w-8 h-8" />
            </div>
          </div>
          <h2
            className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Promecal
          </h2>
          <p
            className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            Sistema de Gestión de Recepción de Pedidos
          </p>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className={darkMode ? 'text-white' : ''}
              >
                Nombre de usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ratatouille77"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full border-gray-300 ${
                  darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : ''
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={darkMode ? 'text-white' : ''}
              >
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full border-gray-300 ${
                  darkMode ? 'bg-gray-700 text-white' : ''
                }`}
              />
            </div>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              type="submit"
            >
              <Lock className="mr-2 h-4 w-4" /> Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <a
            href="#"
            className={`text-sm text-center ${
              darkMode ? 'text-orange-300' : 'text-orange-600'
            } hover:underline`}
          >
            ¿Necesita ayuda? Contacte a soporte técnico
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
