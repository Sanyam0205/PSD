import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import header from '../assets/images.png';
import footer from '../assets/footer.png';
import { toWords } from 'number-to-words'; // Importing from number-to-words


const numberToWords = (num) => {
  try {
    return toWords(num).toUpperCase(); // Converting to words and capitalizing
  } catch (error) {
    console.error('Error converting number to words:', error);
    return 'NUMBER TOO LARGE';
  }
};

const styles = StyleSheet.create({
  borderWrapper: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #000', // Thin border
    paddingTop: 10,
    paddingBottom: 80,
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
    width: '100%',
  },

  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 80, // Increased space for header
    paddingBottom: 80, // Increased space for footer
    paddingLeft: 20,
    paddingRight: 20,
    position: 'relative',
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
  image: {
    width: '50%',
    height: '82%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerimage: {
    width: '85%',
    height: '92%',
  },
  headerRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    textAlign: 'right',
    border: '1px solid #000',
    padding: 2,
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
    wordWrap: 'break-word',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    textAlign: 'left',
    fontSize: 9,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    fontSize: 12,
    textAlign: 'justify',
  },
  text: {
    fontSize: 11, // Adjusted font size to 11

    textAlign: 'justify',
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
  signatureWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'left',
    justifyContent: 'left',
    marginBottom: 60,
  },
  signature: {
    width: 250,
    height: 125,
  },
});

const ProjectOrderPDF = (props) => {
  const renderItemsTable = () => {
    const rows = props.items.map((item, index) => (
      <React.Fragment key={index}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.sno}</Text>
          <Text style={styles.tableCell}>{item.description}</Text>
          <Text style={styles.tableCell}>{item.unit}</Text>
          <Text style={styles.tableCell}>{item.quantity}</Text>
          <Text style={styles.tableCell}>{item.ratePerUnit}</Text>
          <Text style={styles.tableCell}>{item.discount}</Text>
          <Text style={styles.tableCell}>{(item.ratePerUnit * item.quantity * item.discount / 100).toFixed(2)}</Text>
          <Text style={styles.tableCell}>{item.gstPercentage}</Text>
          <Text style={styles.tableCell}>{(item.ratePerUnit * item.quantity * item.gstPercentage / 100).toFixed(2)}</Text>
          <Text style={styles.tableCell}>{item.amount}</Text>
        </View>
        {item.subItems && item.subItems.map((subItem, subIndex) => (
          <View style={styles.tableRow} key={`${index}-${subIndex}`}>
            <Text style={styles.tableCell}>{`${item.sno}.${subIndex + 1}`}</Text>
            <Text style={styles.tableCell}>{`${subItem.description}`}</Text>
            <Text style={styles.tableCell}>{subItem.unit}</Text>
            <Text style={styles.tableCell}>{subItem.quantity}</Text>
            <Text style={styles.tableCell}>{subItem.ratePerUnit}</Text>
            <Text style={styles.tableCell}>{subItem.discount}</Text>
            <Text style={styles.tableCell}>{(subItem.ratePerUnit * subItem.quantity * subItem.discount / 100).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{subItem.gstPercentage}</Text>
            <Text style={styles.tableCell}>{(subItem.ratePerUnit * subItem.quantity * subItem.gstPercentage / 100).toFixed(2)}</Text>
            <Text style={styles.tableCell}>{subItem.amount}</Text>
          </View>
        ))}
      </React.Fragment>
    ));

    const rowsPerPage = 15;
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
              <Text style={[styles.tableCell, styles.tableHeader]}>Discount %</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Discount Amount</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST %</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST Amount</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            </View>
            {rows.slice(i, i + rowsPerPage)}
          </View>
          <View style={styles.footer}>
            <Image style={styles.footerimage} src={footer} />
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
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Vendor Details</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Vendor Code</Text>
              <Text style={styles.tableCell}>{props.vendorCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Vendor Name</Text>
              <Text style={styles.tableCell}>{props.name}</Text>
            </View>
            {/* <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Contact Person</Text>
              <Text style={styles.tableCell}>{props.contactperson}</Text>
            </View> */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Address</Text>
              <Text style={styles.tableCell}>{props.address}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>District</Text>
              <Text style={styles.tableCell}>{props.district}</Text>  
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Pincode</Text>
              <Text style={styles.tableCell}>{props.pinCode}</Text> 
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Email</Text>
              <Text style={styles.tableCell}>{props.email}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Contact</Text>
              <Text style={styles.tableCell}>{props.contact}</Text>
            </View>
            {/* <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST Number</Text>
              <Text style={styles.tableCell}>{props.gstNumber}</Text>
            </View> */}
          </View>
          <View style={styles.table}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Billing Details</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Location Code</Text>
              <Text style={styles.tableCell}>{props.locationCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Contact Person</Text>
              <Text style={styles.tableCell}>{props.billtoname}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Billing Address</Text>
              <Text style={styles.tableCell}>{props.billToAddress}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>District</Text>
              <Text style={styles.tableCell}>{props.billToDistrict}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Pincode</Text>
              <Text style={styles.tableCell}>{props.billToPinCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Phone Number</Text>
              <Text style={styles.tableCell}>{props.billToContact}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Email</Text>
              <Text style={styles.tableCell}>{props.billToEmail}</Text>
            </View>
            {/* <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>GST Number</Text>
              <Text style={styles.tableCell}>{props.billToGstNumber}</Text>
            </View> */}
          </View>
          <View style={styles.table}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Shipping Details</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>location Code</Text>
              <Text style={styles.tableCell}>{props.deliveryLocationCode}</Text>  
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Name</Text>
              <Text style={styles.tableCell}>{props.deliveryName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Shipping Address</Text>
              <Text style={styles.tableCell}>{props.shippingAddress}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>District</Text>
              <Text style={styles.tableCell}>{props.deliveryDistrict}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Pin Code</Text>
              <Text style={styles.tableCell}>{props.deliveryPinCode}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Phone Number</Text>
              <Text style={styles.tableCell}>{props.deliveryContact}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Email</Text>
              <Text style={styles.tableCell}>{props.deliveryEmail}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>Subject: {props.topsection}</Text>
        </View>
        <View style={styles.footer}>
          <Image style={styles.footerimage} src={footer} />
        </View>
      </Page>
      {renderItemsTable()}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.image} src={header} />
        </View>
        <View style={styles.section}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>Total Amount: Rs. {props.totalAmount}</Text>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>Total Amount in Words: Rupees {numberToWords(props.totalAmount)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>Notes:</Text>
          <Text style={styles.text}>{props.Notes}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>Terms and Conditions</Text>
          <Text style={styles.text}>{props.tnc}</Text>
        </View>
        {props.signature && (
          <View style={styles.signatureWrapper}>
            <Image style={styles.signature} src={props.signature ? `http://localhost:5000${props.signature}` : ''} />
          </View>
        )}
        <View style={styles.footer}>
          <Image style={styles.footerimage} src={footer} />
        </View>
      </Page>
    </Document>
  );
};

export default ProjectOrderPDF;
