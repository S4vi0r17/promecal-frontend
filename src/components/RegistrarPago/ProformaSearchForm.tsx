import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Search } from 'lucide-react';

interface ProformaSearchFormProps {
  onSearch: (dni: string) => void;
  cargando: boolean;
}

export function ProformaSearchForm({
  onSearch,
  cargando,
}: ProformaSearchFormProps) {
  const [dni, setDni] = useState('');

  const handleSearch = () => {
    onSearch(dni);
  };

  return (
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
      <Button onClick={handleSearch} className="mt-6" disabled={cargando}>
        <Search className="mr-2 h-4 w-4" /> Buscar
      </Button>
    </div>
  );
}
