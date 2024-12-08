import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FileText } from 'lucide-react';

interface PaymentFileUploadProps {
  onFileChange: (file: File | null) => void;
  comprobante: File | null;
}

export function PaymentFileUpload({
  onFileChange,
  comprobante,
}: PaymentFileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileChange(file || null);
  };

  return (
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
  );
}
