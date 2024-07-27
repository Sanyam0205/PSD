import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font if needed
// Font.register({ family: 'Times-Roman', src: 'path/to/times-roman.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #000', // Border for every page
    padding: 10, // Padding to ensure border is not too close to content
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    width: 'auto',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
});

  
  const ProjectOrderPDF = (props) => (
    <Document>
      <Page size="A4" style={styles.page}></Page>
        <View style={styles.section}>
          <Text style={styles.text}>Vendor Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Field</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Value</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Vendor Code</Text>
              <Text style={styles.tableCell}>{props.vendorCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>{props.name}</Text>
            </View>
            {/* Add more rows as needed */}
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.text}>Billing Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {/* Add billing details table structure */}
            </View>
            {/* Add rows for billing details */}
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.text}>Shipping Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {/* Add shipping details table structure */}
            </View>
            {/* Add rows for shipping details */}
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.text}>Items</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>S.No</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Description</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Unit</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Quantity</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Rate Per Unit</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST %</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Discount %</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            </View>
            {props.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{item.sno}</Text>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.unit}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.ratePerUnit}</Text>
                <Text style={styles.tableCell}>{item.gstPercentage}</Text>
                <Text style={styles.tableCell}>{item.discount}</Text>
                <Text style={styles.tableCell}>{item.amount}</Text>
              </View>
            ))}
          </View>
  
          <Text style={styles.text}>Notes: {props.Notes}</Text>
        </View>
  
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.text}>Terms and Conditions</Text>
            <Text style={styles.text}>{props.tnc}</Text>
          </View>
        </Page>
      </Document>
  );
  
  export default ProjectOrderPDF;
