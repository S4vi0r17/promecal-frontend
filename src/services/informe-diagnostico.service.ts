import api from './api';
import { InformeDiagnosticoDTO } from '@/interfaces/informe-diagnostico.interface';

export const insertarInformeDiagnostico = async (
  informe: InformeDiagnosticoDTO,
  file?: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('informe', JSON.stringify(informe));
  if (file) {
    formData.append('file', file);
  }

  await api.post('/api/informediagnostico', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const tempInsertarInformeDiagnostico = async (
  formData: FormData
): Promise<void> => {
  await api.post('/api/informediagnostico', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
