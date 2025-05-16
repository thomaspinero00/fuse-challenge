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
      <Preview>Daily Transactions Report</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.header}>Fuse Challenge - Daily Transactions Report</Text>
          </Section>

          <Section>
            <Text style={styles.greeting}>Hello, {user.name}!</Text>
            <Text style={styles.paragraph}>These are your transactions of today:</Text>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Symbol</th>
                    <th style={styles.tableHeader}>Quantity</th>
                    <th style={styles.tableHeader}>Price Each</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.tableData}>{transaction.symbol}</td>
                        <td style={styles.tableData}>{transaction.quantity}</td>
                        <td style={styles.tableData}>${transaction.price}</td>
                        <td style={styles.tableData}>{transaction.status}</td>
                        <td style={styles.tableData}>{new Date(transaction.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={styles.noTransaction}>
                        No transactions were executed today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          <Section>
            <Text style={styles.footerText}>
              Thank you for using our service! If you have any questions, feel free to contact us.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
