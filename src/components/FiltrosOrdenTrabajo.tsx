import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type FiltrosOrdenTrabajoProps = {
  filtroFecha: string;
  filtroCodigo: string;
  filtroCliente: string;
  filtroModelo: string;
  filtroMarca: string;
  setFiltroFecha: (value: string) => void;
  setFiltroCodigo: (value: string) => void;
  setFiltroCliente: (value: string) => void;
  setFiltroModelo: (value: string) => void;
  setFiltroMarca: (value: string) => void;
  limpiarFiltros: () => void;
};

export function FiltrosOrdenTrabajo({
  filtroFecha,
  filtroCodigo,
  filtroCliente,
  filtroModelo,
  filtroMarca,
  setFiltroFecha,
  setFiltroCodigo,
  setFiltroCliente,
  setFiltroModelo,
  setFiltroMarca,
  limpiarFiltros,
}: FiltrosOrdenTrabajoProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-lg font-semibold mb-2">Filtros de búsqueda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            htmlFor="filtroFecha"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha
          </label>
          <Input
            id="filtroFecha"
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="filtroCodigo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Código
          </label>
          <Input
            id="filtroCodigo"
            type="text"
            placeholder="Buscar por código"
            value={filtroCodigo}
            onChange={(e) => setFiltroCodigo(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="filtroCliente"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cliente
          </label>
          <Input
            id="filtroCliente"
            type="text"
            placeholder="Buscar por cliente"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="filtroModelo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Modelo
          </label>
          <Input
            id="filtroModelo"
            type="text"
            placeholder="Buscar por modelo"
            value={filtroModelo}
            onChange={(e) => setFiltroModelo(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="filtroMarca"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Marca
          </label>
          <Input
            id="filtroMarca"
            type="text"
            placeholder="Buscar por marca"
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={limpiarFiltros}>
          <X className="w-4 h-4 mr-2" />
          Limpiar Filtros
        </Button>
      </div>
    </div>
  );
}
