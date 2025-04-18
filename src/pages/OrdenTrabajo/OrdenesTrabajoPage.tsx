import { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';

import { FiltrosOrdenTrabajo } from '@/components/VizualizarOrden/FiltrosOrdenTrabajo';
import { TablaOrdenes } from '@/components/VizualizarOrden/TablaOrdenes';
import { DetalleOrdenModal } from '@/components/VizualizarOrden/DetalleOrden';
import Loader from '@/components/Loader';

import { HistorialModificacion, OrdenTrabajo } from '@/types/ordenTrabajo';
import { ResponseData } from '@/interfaces/response-data.interface';

import { useToast } from '@/hooks/use-toast';

// import { generarOrdenesPrueba } from '@/pages/OrdenTrabajo/mockData';

import {
  getHistorialOrdenTrabajo,
  getOrdenesTrabajo,
  getOrdenTrabajoById,
} from '@/services/orden-trabajo.service';

type DetalleOrden = OrdenTrabajo & {
  documentourl: string;
};

export default function OrdenTrabajoPage() {
  const { toast } = useToast();
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [ordenesFiltered, setOrdenesFiltered] = useState<OrdenTrabajo[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<DetalleOrden | null>(null);
  const [historialModificaciones, setHistorialModificaciones] = useState<HistorialModificacion[]>([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [detallesAbiertos, setDetallesAbiertos] = useState(false);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const data = await getOrdenesTrabajo();
        // const data = generarOrdenesPrueba(1000);
        setOrdenes(data);
        setOrdenesFiltered(data);
      } catch {
        if (
          axios.isAxiosError(fetchError) &&
          fetchError.response?.data.message
        ) {
          setFetchError(fetchError.response.data.message);
        } else {
          setFetchError('Error al cargar las órdenes de trabajo');
        }
      } finally {
        setCargando(false);
      }
    };

    fetchOrdenes();
  }, []);

  useEffect(() => {
    const ordenesFiltered = ordenes.filter((orden) => {
      const fechaOrden = new Date(orden.fecha).toISOString().split('T')[0];
      return (
        (filtroFecha === '' || fechaOrden.includes(filtroFecha)) &&
        orden.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()) &&
        orden.nombrecompleto
          .toLowerCase()
          .includes(filtroCliente.toLowerCase()) &&
        orden.modelo.toLowerCase().includes(filtroModelo.toLowerCase()) &&
        orden.marca.toLowerCase().includes(filtroMarca.toLowerCase())
      );
    });
    setOrdenesFiltered(ordenesFiltered);
  }, [
    ordenes,
    filtroFecha,
    filtroCodigo,
    filtroCliente,
    filtroModelo,
    filtroMarca,
  ]);

  const handleSeleccionarOrden = async (id: number) => {
    try {
      const [detalleResponse, historialResponse] = await Promise.all([
        getOrdenTrabajoById(id),
        getHistorialOrdenTrabajo(id),
      ]);

      setOrdenSeleccionada(detalleResponse);
      setHistorialModificaciones(historialResponse);
      setDetallesAbiertos(true);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const { status, message } = axiosError.response.data as ResponseData;
          if (status === 404) {
            setFetchError(message);
          } else {
            setFetchError('Error al cargar las órdenes de trabajo');
          }
        } else {
          setFetchError('No se pudo conectar con el servidor.');
        }
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: fetchError,
      });
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleDescargarPDF = () => {
    if (ordenSeleccionada && ordenSeleccionada.documentourl) {
      window.open(ordenSeleccionada.documentourl, '_blank');
    }
  };

  const handleImprimir = () => {
    if (ordenSeleccionada && ordenSeleccionada.documentourl) {
      const printWindow = window.open(ordenSeleccionada.documentourl, '_blank');
      printWindow?.print();
    }
  };

  const limpiarFiltros = () => {
    setFiltroFecha('');
    setFiltroCodigo('');
    setFiltroCliente('');
    setFiltroModelo('');
    setFiltroMarca('');
  };

  if (cargando) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Visualizar Órdenes de Trabajo</h1>

      <FiltrosOrdenTrabajo
        filtroFecha={filtroFecha}
        filtroCodigo={filtroCodigo}
        filtroCliente={filtroCliente}
        filtroModelo={filtroModelo}
        filtroMarca={filtroMarca}
        setFiltroFecha={setFiltroFecha}
        setFiltroCodigo={setFiltroCodigo}
        setFiltroCliente={setFiltroCliente}
        setFiltroModelo={setFiltroModelo}
        setFiltroMarca={setFiltroMarca}
        limpiarFiltros={limpiarFiltros}
      />

      <TablaOrdenes
        ordenes={ordenesFiltered}
        onSeleccionarOrden={handleSeleccionarOrden}
      />

      <DetalleOrdenModal
        orden={ordenSeleccionada}
        historial={historialModificaciones}
        abierto={detallesAbiertos}
        onOpenChange={setDetallesAbiertos}
        onDescargarPDF={handleDescargarPDF}
        onImprimir={handleImprimir}
      />
    </div>
  );
}
