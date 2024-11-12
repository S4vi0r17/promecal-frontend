import { useState, useEffect } from 'react';
import { User, Lock, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function Component() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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

    try {
      const response = await axios.post<{ token: string }>(
        'http://localhost:8080/auth/login',
        {
          nombreusuario: username,
          contrasena: password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          console.error(
            'Error en la solicitud:',
            axiosError.response.status,
            axiosError.response.data
          );
        } else {
          console.error('Error en el cliente:', axiosError.message);
        }
      } else {
        console.error('Error desconocido:', error);
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
            Sistema de Gestíón de Recepción de Pedidos
          </p>
        </CardHeader>
        <CardContent>
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
