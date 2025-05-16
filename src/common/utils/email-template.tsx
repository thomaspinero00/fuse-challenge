import type { ReportEmailTemplateProps } from '../react-components/templates/ReportEmail';
import { ReportEmailTemplate } from '../react-components/templates/ReportEmail';
import React from 'react';

export const getEmailComponent = (body: ReportEmailTemplateProps): React.ReactElement => {
  return <ReportEmailTemplate {...body} />;
};
