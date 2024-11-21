import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ProformaServicioListaDTO } from '@/interfaces/proforma-servicio.interface';

interface ProformaSelectorProps {
  proformas: ProformaServicioListaDTO[];
  onSelectProforma: (proforma: ProformaServicioListaDTO | null) => void;
}

export function ProformaSelector({
  proformas,
  onSelectProforma,
}: ProformaSelectorProps) {
  return (
    <div>
      <Label htmlFor="proforma-select">Seleccione una proforma</Label>
      <Select
        onValueChange={(value) =>
          onSelectProforma(
            proformas.find((p) => p.id === parseInt(value)) || null
          )
        }
      >
        <SelectTrigger id="proforma-select">
          <SelectValue placeholder="Seleccione una proforma" />
        </SelectTrigger>
        <SelectContent>
          {proformas.map((proforma) => (
            <SelectItem key={proforma.id} value={proforma.id.toString()}>
              Proforma #{proforma.codigo_ordentrabajo} - S/.{' '}
              {proforma.precioServicio}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
