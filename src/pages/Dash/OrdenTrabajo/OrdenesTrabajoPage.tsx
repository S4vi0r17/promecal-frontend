import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FiltrosOrdenTrabajo } from '@/components/FiltrosOrdenTrabajo';
import { TablaOrdenes } from '@/components/TablaOrdenes';
import { DetalleOrdenModal } from '@/components/DetalleOrden';
import { HistorialModificacion, OrdenTrabajo } from '@/types/ordenTrabajo';
import api from '@/services/api';

type DetalleOrden = OrdenTrabajo & {
  documentourl: string;
};

export default function Component() {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [ordenesFiltered, setOrdenesFiltered] = useState<OrdenTrabajo[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] =
    useState<DetalleOrden | null>(null);
  const [historialModificaciones, setHistorialModificaciones] = useState<
    HistorialModificacion[]
  >([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [detallesAbiertos, setDetallesAbiertos] = useState(false);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await api.get(
          'http://localhost:8080/api/ordentrabajo'
        );
        setOrdenes(response.data);
        setOrdenesFiltered(response.data);
        setCargando(false);
      } catch (error) {
        setError('Error al cargar las órdenes de trabajo');
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
        api.get(`http://localhost:8080/api/ordentrabajo/${id}`),
        api.get(`http://localhost:8080/api/ordentrabajo/${id}/historial`),
      ]);

      setOrdenSeleccionada(detalleResponse.data);
      setHistorialModificaciones(historialResponse.data);
      setDetallesAbiertos(true);
    } catch (error) {
      setError('Error al cargar los detalles de la orden');
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
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
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