import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, FileText, AlertCircle } from 'lucide-react';
import { ProformaServicioListaDTO } from '@/interfaces/proforma-servicio.interface';
import api from '@/services/api';

export default function RegistrarPago() {
  const [dni, setDni] = useState('');
  const [proformas, setProformas] = useState<ProformaServicioListaDTO[]>([]);
  const [proformaSeleccionada, setProformaSeleccionada] = useState<ProformaServicioListaDTO | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const buscarProformas = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await api.get(
        `http://localhost:8080/api/proformaservicio/cliente/${dni}`
      );
      setProformas(response.data);
      setProformaSeleccionada(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al buscar las proformas'
      );
      setProformas([]);
    } finally {
      setCargando(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setComprobante(file);
      setError('');
    } else {
      setError('Por favor, seleccione un archivo válido');
      setComprobante(null);
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

      await api.post(
        `http://localhost:8080/api/proformaservicio/${proformaSeleccionada.id}/pago`,
        formData
      );

      setExito(true);
      // Actualizar el estado de la proforma localmente
      setProformas(
        proformas.map((p) =>
          p.id === proformaSeleccionada.id ? { ...p, estadoPago: 'Pagada' } : p
        )
      );
      setProformaSeleccionada(null);
      setComprobante(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al registrar el pago'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Pago</CardTitle>
        <CardDescription>
          Ingrese el DNI del cliente para buscar sus proformas pendientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Label htmlFor="dni">DNI del Cliente</Label>
              <Input
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ingrese DNI"
              />
            </div>
            <Button
              onClick={buscarProformas}
              className="mt-6"
              disabled={cargando}
            >
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>

          {proformas.length > 0 && (
            <div>
              <Label htmlFor="proforma-select">Seleccione una proforma</Label>
              <Select
                onValueChange={(value) =>
                  setProformaSeleccionada(
                    proformas.find((p) => p.id === parseInt(value)) || null
                  )
                }
              >
                <SelectTrigger id="proforma-select">
                  <SelectValue placeholder="Seleccione una proforma" />
                </SelectTrigger>
                <SelectContent>
                  {proformas.map((proforma) => (
                    <SelectItem
                      key={proforma.id}
                      value={proforma.id.toString()}
                    >
                      Proforma #{proforma.codigo_ordentrabajo} - S/.{' '}
                      {proforma.precioServicio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {proformaSeleccionada && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Proforma</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Código de Orden: {proformaSeleccionada.codigo_ordentrabajo}
                </p>
                <p>
                  Detalle del Servicio: {proformaSeleccionada.detalleServicio}
                </p>
                <p>Precio: S/. {proformaSeleccionada.precioServicio}</p>
                <p>
                  Tiempo Estimado de Entrega:{' '}
                  {proformaSeleccionada.tiempoEstimadoEntrega}
                </p>
                <p>
                  Condiciones de Contratación:{' '}
                  {proformaSeleccionada.condicionesContratacion}
                </p>
                <p>Estado de Pago: {proformaSeleccionada.estadoPago}</p>
                <p>
                  Fecha:{' '}
                  {new Date(proformaSeleccionada.fecha).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )}

          {proformaSeleccionada && (
            <div>
              <Label htmlFor="comprobante">Comprobante de Pago</Label>
              <Input id="comprobante" type="file" onChange={handleFileChange} />
              {comprobante && (
                <div className="mt-2">
                  <FileText className="h-6 w-6 inline-block mr-2" />
                  <span>{comprobante.name}</span>
                </div>
              )}
            </div>
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
        <Button
          variant="outline"
          onClick={() => {
            setDni('');
            setProformas([]);
            setProformaSeleccionada(null);
            setComprobante(null);
            setError('');
            setExito(false);
          }}
        >
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
  );
}
