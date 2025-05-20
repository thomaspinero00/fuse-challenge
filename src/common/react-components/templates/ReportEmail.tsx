import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';
import { emailStyles } from '../styles/reportEmail.styles';
import { User } from 'src/services/data-services/entities/user.entity';
import { Transaction, TRANSACTION_STATUSES } from 'src/services/data-services/entities/transaction.entity';
export interface ReportEmailTemplateProps {
  user: User;
  transactions: Transaction[];
}
export const ReportEmailTemplate: React.FC<ReportEmailTemplateProps> = ({ user, transactions }) => {
  const getStatusStyle = (status: TRANSACTION_STATUSES) => {
    return status === TRANSACTION_STATUSES.SUCCESSFUL ? emailStyles.statusSuccessful : emailStyles.statusFailed;
  };
  return (
    <Html>
      <Head /> <Preview>Daily Transactions Report</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section>
            <Text style={emailStyles.header}>Fuse Challenge - Daily Transactions Report</Text>
          </Section>
          <Section>
            <Text style={emailStyles.greeting}>Hello, {user.name}!</Text>
            <Text style={emailStyles.paragraph}>These are your transactions of today:</Text>
            <div style={emailStyles.tableContainer}>
              <table style={emailStyles.table}>
                <thead>
                  <tr>
                    <th style={emailStyles.tableHeader}>Symbol</th> <th style={emailStyles.tableHeader}>Quantity</th>
                    <th style={emailStyles.tableHeader}>Price Each</th> <th style={emailStyles.tableHeader}>Status</th>
                    <th style={emailStyles.tableHeader}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} style={{ ...(index % 2 === 0 ? emailStyles.tableRowEven : {}) }}>
                        <td style={emailStyles.tableData}>{transaction.symbol}</td>
                        <td style={emailStyles.tableData}>{transaction.quantity}</td>
                        <td style={emailStyles.tableData}>${transaction.price}</td>
                        <td style={emailStyles.tableData}>
                          <span style={getStatusStyle(transaction.status)}> {transaction.status} </span>
                        </td>
                        <td style={emailStyles.tableData}> {new Date(transaction.createdAt).toLocaleString()} </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={emailStyles.noTransaction}>
                        No transactions were executed today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
          <Section style={emailStyles.footer}>
            <Text> Thank you for using our service! If you have any questions, feel free to contact us. </Text>
            <Text style={emailStyles.companyInfo}> © 2025 Fuse Challenge. All rights reserved. </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
