import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import header from '../assets/images.png';
import footer from '../assets/footer.png';

// Register a font if needed
// Font.register({ family: 'Times-Roman', src: 'path/to/times-roman.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 60, // Padding to ensure content does not overlap with the header
    paddingBottom: 60, // Padding to ensure content does not overlap with the footer
    paddingLeft: 20, // Increase left padding to accommodate border
    paddingRight: 20, // Increase right padding to accommodate border
    position: 'relative',
  },
  borderWrapper: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '10px solid #000', // Border for every page
    paddingTop: 10, // Adjust padding to ensure content is within border
    paddingBottom: 10, // Adjust padding to ensure content is within border
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
    width: '100%',
  },
    header: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    textAlign: 'right',
  },
  image: {
    width: 100,
    height: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    wordWrap: 'break-word', // Ensure text wraps inside table cells
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    // borderRightWidth: 1,
    flex: 1,
    textAlign: 'left', // Align text to the left
    fontSize: 9, // Ensuring font size is consistent
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#ffffff', // Slightly different background color for headers
    fontSize: 12, // Match font size of table content
    textAlign: 'left', // Center align headers
  },
  text: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  customTextSection: {
    marginBottom: 10,
    
  },
  itemsTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    wordWrap: 'break-word',
    marginTop: 10,
  },
});

const ProjectOrderPDF = (props) => {
  const renderItemsTable = () => {
    const rows = props.items.map((item, index) => (
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
    ));

    const rowsPerPage = 15; // Adjust this number based on your layout
    const pages = [];

    for (let i = 0; i < rows.length; i += rowsPerPage) {
      pages.push(
        <Page key={i} size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.header}>
            <Image style={styles.image} src={header} />
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.text}>PO Number: {props.poNumber}</Text>
            <Text style={styles.text}>PO Date: {props.poDate}</Text>
            <Text style={styles.text}>Delivery Date: {props.deliveryDate}</Text>
          </View>
          <View style={styles.itemsTable}>
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
            {rows.slice(i, i + rowsPerPage)}
          </View>
          <View style={styles.footer}>
            <Image style={styles.image} src={footer} />
          </View>
        </Page>
      );
    }

    return pages;
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.image} src={header} />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.text}>PO Number: {props.poNumber}</Text>
          <Text style={styles.text}>PO Date: {props.poDate}</Text>
          <Text style={styles.text}>Delivery Date: {props.deliveryDate}</Text>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <Text style={styles.text}>Vendor Details</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Vendor Code</Text>
              <Text style={styles.tableCell}>{props.vendorCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Vendor Name</Text>
              <Text style={styles.tableCell}>{props.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Contact Person</Text>
              <Text style={styles.tableCell}>{props.contactperson}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Address</Text>
              <Text style={styles.tableCell}>{props.address}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Email</Text>
              <Text style={styles.tableCell}>{props.email}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Contact</Text>
              <Text style={styles.tableCell}>{props.contact}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST Number</Text>
              <Text style={styles.tableCell}>{props.gstNumber}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text style={styles.text}>Billing Details</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Billing Address</Text>
              <Text style={styles.tableCell}>{props.billToAddress}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST Number</Text>
              <Text style={styles.tableCell}>{props.billToGstNumber}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text style={styles.text}>Shipping Details</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Shipping Address</Text>
              <Text style={styles.tableCell}>{props.shippingAddress}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Pincode</Text>
              <Text style={styles.tableCell}>{props.pinCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Phone Number</Text>
              <Text style={styles.tableCell}>{props.shippingPhoneNumber}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
            <Text style={styles.text}>Subject: {props.topsection}</Text>
        </View>
        <View style={styles.footer}>
          <Image style={styles.image} src={footer} />
        </View>
      </Page>
      {renderItemsTable()}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.image} src={header} />
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Notes: {props.Notes}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Terms and Conditions</Text>
          <Text style={styles.text}>{props.tnc}</Text>
        </View>
        <View style={styles.footer}>
          <Image style={styles.image} src={footer} />
        </View>
      </Page>
    </Document>
  );
};

export default ProjectOrderPDF;
