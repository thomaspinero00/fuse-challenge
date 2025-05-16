import { Body, Container, Head, Html, Img, Link, Preview, Row, Section, Text } from '@react-email/components';
import * as React from 'react';
import { styles } from '../styles/constants.react.email';
import { User } from 'src/services/data-services/entities/user.entity';
import { Transaction } from 'src/services/data-services/entities/transaction.entity';

export interface ReportEmailTemplateProps {
  user: User;
  transactions: Transaction[];
}

export const ReportEmailTemplate: React.FC<ReportEmailTemplateProps> = ({ user, transactions }) => {
  return (
    <Html>
      <Head />
      <Preview>Hello friend this is the preview</Preview>
      <Body style={styles.main}>
        <p>Hola hola hola, {user.name}</p>

        <p>Transactions:</p>
        {transactions.map((transaction, index) => (
          <p key={index}>
            {transaction.symbol}: {transaction.quantity} shares at ${transaction.price} each / {transaction.status}
          </p>
        ))}
      </Body>
    </Html>
  );
};
