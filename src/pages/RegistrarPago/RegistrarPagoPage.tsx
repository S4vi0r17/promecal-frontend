import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { ProformaSearchForm } from '@/components/RegistrarPago/ProformaSearchForm';
import { ProformaSelector } from '@/components/RegistrarPago/ProformaSelector';
import { ProformaDetails } from '@/components/RegistrarPago/ProformaDetails';
import { PaymentFileUpload } from '@/components/RegistrarPago/PaymentFileUpload';

import { ProformaServicioListaDTO } from '@/interfaces/proforma-servicio.interface';

import {
  obtenerProformaServicioPorCliente,
  registrarPagoService,
} from '@/services/proforma-servicio.service';
import axios from 'axios';
import { AxiosError } from 'axios';
import { ResponseData } from '@/interfaces/response-data.interface';

export default function RegistrarPago() {
  const [proformas, setProformas] = useState<ProformaServicioListaDTO[]>([]);
  const [proformaSeleccionada, setProformaSeleccionada] =
    useState<ProformaServicioListaDTO | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const buscarProformas = async (dni: string) => {
    setCargando(true);
    setError('');
    try {
      const data = await obtenerProformaServicioPorCliente(dni);
      setProformas(data);
      setProformaSeleccionada(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const { status, message } = axiosError.response.data as ResponseData;
          if (status === 404) {
            setError(message);
          }
        }
      }
      // setError(
      //   err instanceof Error
      //     ? err.message
      //     : 'Ocurrió un error al buscar las proformas'
      // );
      setProformas([]);
    } finally {
      setCargando(false);
    }
  };

  const registrarPago = async () => {
    if (!proformaSeleccionada || !comprobante) {
      setError(
        'Por favor, seleccione una proforma y añada un comprobante de pago'
      );
      return;
    }

    setCargando(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', comprobante);

      await registrarPagoService(proformaSeleccionada.id, comprobante);

      setExito(true);
      setProformas(
        proformas.map((p) =>
          p.id === proformaSeleccionada.id ? { ...p, estadoPago: 'Pagada' } : p
        )
      );
      setProformaSeleccionada(null);
      setComprobante(null);
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al registrar el pago'
      );
    } finally {
      setCargando(false);
    }
  };

  const resetForm = () => {
    setProformas([]);
    setProformaSeleccionada(null);
    setComprobante(null);
    setError('');
    setExito(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Registrar Pago</CardTitle>
          <CardDescription>
            Ingrese el DNI del cliente para buscar sus proformas pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProformaSearchForm
              onSearch={buscarProformas}
              cargando={cargando}
            />

            {proformas.length > 0 && (
              <ProformaSelector
                proformas={proformas}
                onSelectProforma={setProformaSeleccionada}
              />
            )}

            {proformaSeleccionada && (
              <ProformaDetails proforma={proformaSeleccionada} />
            )}

            {proformaSeleccionada && (
              <PaymentFileUpload
                onFileChange={setComprobante}
                comprobante={comprobante}
              />
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {exito && (
              <Alert>
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>
                  El pago ha sido registrado exitosamente.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={resetForm}>
            Cancelar
          </Button>
          <Button
            onClick={registrarPago}
            disabled={!proformaSeleccionada || !comprobante || cargando}
          >
            {cargando ? 'Procesando...' : 'Registrar Pago'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
