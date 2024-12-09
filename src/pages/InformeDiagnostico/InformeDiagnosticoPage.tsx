import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import {
  getOrdenesTrabajo,
  getOrdenTrabajoById,
} from '@/services/orden-trabajo.service';
import { tempInsertarInformeDiagnostico } from '@/services/informe-diagnostico.service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { AxiosError } from 'axios';
import { ResponseData } from '@/interfaces/response-data.interface';

interface OrdenTrabajo {
  id: number;
  descripcion: string;
}

interface FormData {
  id_ordenTrabajo: number | null;
  numeroSerie: string;
  estadoActual: string;
  problemasEncontrados: string;
  diagnosticoTecnico: string;
  recomendaciones: string;
  factibilidadReparacion: 'Alta' | 'Media' | 'Baja';
  equipoirreparable: boolean;
  justificacionIrreparable: string;
  file: File | null;
}

export default function InformeDiagnosticoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<OrdenTrabajo[]>([]);
  const [, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id_ordenTrabajo: null,
    numeroSerie: '',
    estadoActual: '',
    problemasEncontrados: '',
    diagnosticoTecnico: '',
    recomendaciones: '',
    factibilidadReparacion: 'Media',
    equipoirreparable: false,
    justificacionIrreparable: '',
    file: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  useEffect(() => {
    const fetchOrdenesTrabajo = async () => {
      try {
        const data = await getOrdenesTrabajo();
        setOrdenesTrabajo(data);
      } catch (error) {
        console.error('Error fetching ordenes de trabajo:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las órdenes de trabajo.',
          variant: 'destructive',
        });
      }
    };

    fetchOrdenesTrabajo();
  }, []);

  const onOrdenTrabajoChange = async (id: number) => {
    try {
      const data = await getOrdenTrabajoById(id);
      setSelectedOrden(data);
      setFormData((prev) => ({ ...prev, id_ordenTrabajo: id }));
    } catch (error) {
      console.error('Error fetching orden de trabajo:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información de la orden de trabajo.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, equipoirreparable: checked }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.id_ordenTrabajo)
      newErrors.id_ordenTrabajo = 'Seleccione una orden de trabajo';
    if (!formData.numeroSerie)
      newErrors.numeroSerie = 'El número de serie es requerido';
    if (!formData.estadoActual)
      newErrors.estadoActual = 'El estado actual es requerido';
    if (!formData.problemasEncontrados)
      newErrors.problemasEncontrados =
        'Los problemas encontrados son requeridos';
    if (!formData.diagnosticoTecnico)
      newErrors.diagnosticoTecnico = 'El diagnóstico técnico es requerido';
    if (!formData.recomendaciones)
      newErrors.recomendaciones = 'Las recomendaciones son requeridas';
    if (formData.equipoirreparable && !formData.justificacionIrreparable) {
      newErrors.justificacionIrreparable =
        'La justificación es requerida para equipos irreparables';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        'informe',
        new Blob(
          [JSON.stringify({ ...formData, fecha: new Date().toISOString() })],
          {
            type: 'application/json',
          }
        )
      );

      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      // const response = await api.post(
      //   'http://localhost:8080/api/informediagnostico',
      //   formDataToSend,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );

      await tempInsertarInformeDiagnostico(formDataToSend);

      // Mostrar el toast de confirmación
      toast({
        title: 'Informe guardado',
        description:
          'El informe de diagnóstico se ha guardado y enviado correctamente.',
      });

      // Limpiar el formulario
      setFormData({
        id_ordenTrabajo: null,
        numeroSerie: '',
        estadoActual: '',
        problemasEncontrados: '',
        diagnosticoTecnico: '',
        recomendaciones: '',
        factibilidadReparacion: 'Media',
        equipoirreparable: false,
        justificacionIrreparable: '',
        file: null,
      });

      setSelectedOrden(null); // Si quieres limpiar también el estado de la orden seleccionada
    } catch (error) {
      console.error('Error submitting form:', error);

      if (axios.isAxiosError(error)) {
        console.error('Error:', error.response?.data);
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const { message } = axiosError.response.data as ResponseData;
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-16 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-2xl font-bold mb-6">Informe de Diagnóstico</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="id_ordenTrabajo">Número de Orden de Trabajo</Label>
            <Select
              onValueChange={(value) => onOrdenTrabajoChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una orden de trabajo" />
              </SelectTrigger>
              <SelectContent>
                {ordenesTrabajo.map((orden) => (
                  <SelectItem key={orden.id} value={orden.id.toString()}>
                    {orden.id} - {orden.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_ordenTrabajo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_ordenTrabajo}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="numeroSerie">Número de Serie</Label>
            <Input
              id="numeroSerie"
              name="numeroSerie"
              value={formData.numeroSerie}
              onChange={handleInputChange}
              placeholder="Número de serie del equipo"
            />
            {errors.numeroSerie && (
              <p className="text-red-500 text-sm mt-1">{errors.numeroSerie}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="estadoActual">Estado Actual del Equipo</Label>
            <Textarea
              id="estadoActual"
              name="estadoActual"
              value={formData.estadoActual}
              onChange={handleInputChange}
              placeholder="Describa el estado actual del equipo"
            />
            {errors.estadoActual && (
              <p className="text-red-500 text-sm mt-1">{errors.estadoActual}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="problemasEncontrados">Problemas Encontrados</Label>
            <Textarea
              id="problemasEncontrados"
              name="problemasEncontrados"
              value={formData.problemasEncontrados}
              onChange={handleInputChange}
              placeholder="Detalle los problemas encontrados"
            />
            {errors.problemasEncontrados && (
              <p className="text-red-500 text-sm mt-1">
                {errors.problemasEncontrados}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="diagnosticoTecnico">Diagnóstico Técnico</Label>
            <Textarea
              id="diagnosticoTecnico"
              name="diagnosticoTecnico"
              value={formData.diagnosticoTecnico}
              onChange={handleInputChange}
              placeholder="Ingrese el diagnóstico técnico"
            />
            {errors.diagnosticoTecnico && (
              <p className="text-red-500 text-sm mt-1">
                {errors.diagnosticoTecnico}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="recomendaciones">Recomendaciones</Label>
            <Textarea
              id="recomendaciones"
              name="recomendaciones"
              value={formData.recomendaciones}
              onChange={handleInputChange}
              placeholder="Ingrese las recomendaciones"
            />
            {errors.recomendaciones && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recomendaciones}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="factibilidadReparacion">
              Factibilidad de Reparación
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange('factibilidadReparacion', value)
              }
              defaultValue={formData.factibilidadReparacion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la factibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file">Adjuntar Archivo</Label>
            <Input id="file" type="file" onChange={handleFileChange} />
          </div>

          <div className="flex items-center space-x-2 md:col-span-2">
            <Checkbox
              id="equipoirreparable"
              checked={formData.equipoirreparable}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="equipoirreparable">Equipo Irreparable</Label>
          </div>

          {formData.equipoirreparable && (
            <div className="md:col-span-2">
              <Label htmlFor="justificacionIrreparable">
                Justificación Técnica Detallada
              </Label>
              <Textarea
                id="justificacionIrreparable"
                name="justificacionIrreparable"
                value={formData.justificacionIrreparable}
                onChange={handleInputChange}
                placeholder="Ingrese la justificación técnica detallada"
              />
              {errors.justificacionIrreparable && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.justificacionIrreparable}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar y Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
