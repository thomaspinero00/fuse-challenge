import type { ReportEmailTemplateProps } from '../react-components/templates/ReportEmail';
import { ReportEmailTemplate } from '../react-components/templates/ReportEmail';
import React from 'react';

// Función para crear el componente de correo electrónico
export const getEmailComponent = (body: ReportEmailTemplateProps): React.ReactElement => {
  return <ReportEmailTemplate {...body} />;
};
