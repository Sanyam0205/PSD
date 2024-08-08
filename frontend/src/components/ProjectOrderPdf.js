import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { toWords } from 'number-to-words'; // Importing from number-to-words
import times from '../assets/Times New Roman.ttf'; // Importing the font file

Font.register({
  family: 'TimesNewRoman',
  src: times,
});

const numberToWords = (num) => {
  try {
    const str = toWords(num);
    const arr = str.split(' ');

    const indianWords = arr.map(word => {
      switch (word) {
        case 'thousand':
          return 'thousand';
        case 'million':
          return 'lakh';
        case 'billion':
          return 'crore';
        default:
          return word;
      }
    });

    return indianWords.join(' ').toUpperCase(); // Converting to words and capitalizing
  } catch (error) {
    console.error('Error converting number to words:', error);
    return 'NUMBER TOO LARGE';
  }
};

const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
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
    paddingBottom: 20, // Increased space for footer
    paddingLeft: 20,
    paddingRight: 20,
    position: 'relative',
  },

  header: {
    position: 'absolute',
    top: 10,
    left: 0, // Align to the edges
    right: 0, // Align to the edges
    textAlign: 'center',
    alignItems: 'center', // Center content horizontally
    paddingBottom: 10,
  },

  itemsrow:{
    borderRight: '1px solid #000',
    borderLeft:'1px solid #000',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 11,
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
  },
  image: {
    width: '50%',
    height: '82%',
  },
  footerTextBoldUnderline: {
    fontSize: 20,
    fontFamily: 'TimesNewRoman',
    fontWeight: 'bold',
    textDecoration: 'underline',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // top: 1,
    height: 46, // Adjusted height for text
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 10,

  },
  headerRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    textAlign: 'right',
    border: '1px solid #000',
    padding: 2,
  },

  tableWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dataTable: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  dataCell: {
    flex: 1,
    fontSize: 10,
    padding: 2,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  dataHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },

  fixedHeightText: {
    height: 80, // Adjust this height to fit 4 lines
    padding: 2,
    textAlign: 'left',
    fontSize: 10, // Adjust font size as needed
    overflow: 'hidden', // Hide any overflow text
    fontFamily: 'TimesNewRoman',
  },
  contentText: {
    fontSize: 11,
    fontFamily: 'TimesNewRoman',
    textAlign: 'justify',
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
    height: '60%',
  },

  tableCell: {
    fontSize: 12,
    width:'55%',
    padding: '1',
    justifyContent: 'center'
  },

  wideColumn: {
    width: '100%', // Example width
  },

  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    fontSize: 12,
    fontFamily: 'TimesNewRoman',
    paddingTop: '15'
  },
  text: {
    fontSize: 11, // Adjusted font size to 11
    fontFamily: 'TimesNewRoman',
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
    flex: 'auto',
    textAlign: 'center',
    fontSize: 9
  },

  itemrow:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
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
  texthead: {
    fontSize: 14,
    fontFamily: 'TimesNewRoman',
    fontWeight: 'bold',
  },
  textalign: {
    fontSize: 13,
    fontFamily: 'TimesNewRoman',  
    textAlign: 'center',
  },
  amttext: {
    fontFamily: 'TimesNewRoman',
    textAlign: 'right',
  },
  tabletext: {
    fontFamily: 'TimesNewRoman',
    justifyContent:'center'
  },
});

const ProjectOrderPDF = (props) => {
  const renderItemsTable = () => {
    const rows = props.items.map((item, index) => {
      const subItemDiscountAmount = item.subItems.reduce((total, subItem) => total + (subItem.ratePerUnit * subItem.quantity * subItem.discount / 100), 0);
      const subItemGSTAmount = item.subItems.reduce((total, subItem) => total + ((subItem.ratePerUnit * subItem.quantity - (subItem.ratePerUnit * subItem.quantity * subItem.discount / 100)) * subItem.gstPercentage / 100), 0);

      const subItemRows = item.subItems.map((subItem, subIndex) => (
        <View style={styles.itemrow} key={`${index}-${subIndex}`}>
          <Text style={[styles.tableCell, styles.tabletext]}>{`${item.sno}.${subIndex + 1}`}</Text>
          <Text style={[styles.tableCell, styles.tabletext]}>{subItem.description}</Text>
          <Text style={[styles.tableCell, styles.tabletext]}>{subItem.unit}</Text>
          <Text style={[styles.tableCell, styles.tabletext]}>{subItem.quantity}</Text>
          <Text style={[styles.tableCell, styles.amttext]}>{formatNumber(subItem.ratePerUnit)}</Text>
          <Text style={[styles.tableCell, styles.tabletext]}>{formatNumber(subItem.discount)}</Text>
          <Text style={[styles.tableCell, styles.amttext]}>
            {formatNumber((subItem.ratePerUnit * subItem.quantity * subItem.discount / 100).toFixed(2))}
          </Text>
          <Text style={[styles.tableCell, styles.tabletext]}>{subItem.gstPercentage}</Text>
          <Text style={[styles.tableCell, styles.amttext]}>
            {formatNumber(((subItem.ratePerUnit * subItem.quantity - (subItem.ratePerUnit * subItem.quantity * subItem.discount / 100)) * subItem.gstPercentage / 100).toFixed(2))}
          </Text>
          <Text style={[styles.tableCell, styles.amttext]}>{formatNumber(subItem.amount)}</Text>
        </View>
      ));

      return (
        <React.Fragment key={index}>
          <View style={styles.itemrow}>
            <Text style={[styles.tableCell, styles.tabletext]}>{item.sno}</Text>
            <Text style={[styles.tableCell, styles.tabletext]}>{item.description}</Text>
            <Text style={[styles.tableCell, styles.tabletext]}>{item.unit}</Text>
            <Text style={[styles.tableCell, styles.tabletext]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.amttext]}>{formatNumber(item.ratePerUnit)}</Text>
            <Text style={[styles.tableCell, styles.tabletext]}>{item.discount}</Text>
            <Text style={[styles.tableCell, styles.amttext]}>
              {formatNumber((subItemDiscountAmount).toFixed(2))}
            </Text>
            <Text style={[styles.tableCell, styles.tabletext]}>{item.gstPercentage}</Text>
            <Text style={[styles.tableCell, styles.amttext]}>
              {formatNumber((subItemGSTAmount).toFixed(2))}
            </Text>
            <Text style={[styles.tableCell, styles.amttext]}>{formatNumber(item.amount)}</Text>
          </View>
          {subItemRows}
        </React.Fragment>
      );
    });

    const rowsPerPage = 15;
    const pages = [];

    for (let i = 0; i < rows.length; i += rowsPerPage) {
      pages.push(
        <Page key={i} size="A4" orientation="landscape" style={styles.page}>
          {i === 0 && (
            <>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>GIRIK ENTERPRISES</Text>
                <Text style={styles.headerText}>
                  Email id:- girik.enterprices24@gmail.com  |  Contact number:- 9560666158
                </Text>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.text}>PO Number: {props.poNumber}</Text>
                <Text style={styles.text}>PO Date: {props.poDate}</Text>
                <Text style={styles.text}>Delivery Date: {props.podeliveryDate}</Text>
              </View>
            </>
          )}
          <View style={styles.itemsrow}>
            <View style={styles.itemrow}>
              <Text style={[styles.itemsTable, styles.tableHeader]}>S.No</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Description</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Unit</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Quantity</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Rate Per Unit</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Discount %</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Net Amount</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>GST %</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>GST Amount</Text>
              <Text style={[styles.itemsTable, styles.tableHeader]}>Amount</Text>
            </View>
            {rows.slice(i, i + rowsPerPage)}
          </View>
          {i + rowsPerPage >= rows.length && (
            <View style={styles.section}>
              <Text style={[styles.texthead]}>Total Amount: Rs. {props.totalAmount}</Text>
              <Text style={[styles.texthead]}>Total Amount in Words: Rupees {numberToWords(props.totalAmount)}</Text>
              <Text style={[styles.textalign]}>------------------Intentionally Left Blank------------------</Text>
            </View>
          )}
          <View style={styles.footer}>
            <Text style={styles.footerTextBoldUnderline}>GIRIK ENTERPRISES</Text>
            <Text style={styles.footerText}>736A/5, PATEL NAGAR, JHARSA ROAD, POLICE LINE, BACK GATE, GURGAON, HARYANA 122006</Text>
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
    <Text style={styles.headerTitle}>GIRIK ENTERPRISES</Text>
    <Text style={styles.headerText}>
      Email id:- girik.enterprices24@gmail.com | Contact number:- 9560666158
    </Text>
  </View>
  
  <View style={styles.headerDetails}>
    <Text style={styles.contentText}>PO Number: {props.poNumber}</Text>
    <Text style={styles.contentText}>PO Date: {props.poDate}</Text>
    <Text style={styles.contentText}>Delivery Date: {props.podeliverydate}</Text>
  </View>

  <View style={styles.tableWrapper}>
    <View style={styles.dataTable}>
      <Text style={styles.dataHeader}>Vendor Details</Text>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Code</Text>
        <Text style={styles.dataCell}>{props.vendorCode}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Name</Text>
        <Text style={styles.dataCell}>{props.name}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Contact Person</Text>
        <Text style={styles.dataCell}>{props.contactperson}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Address</Text>
        <Text style={[styles.dataCell, styles.fixedHeightText]}>{props.address}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>District</Text>
        <Text style={styles.dataCell}>{props.district}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>State</Text>
        <Text style={styles.dataCell}>{props.state}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Pincode</Text>
        <Text style={styles.dataCell}>{props.pinCode}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Email</Text>
        <Text style={styles.dataCell}>{props.email}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Contact</Text>
        <Text style={styles.dataCell}>{props.contact}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>GST Number</Text>
        <Text style={styles.dataCell}>{props.gstNumber}</Text>
      </View>
    </View>

    <View style={styles.dataTable}>
      <Text style={styles.dataHeader}>Billing Details</Text>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Location Code</Text>
        <Text style={styles.dataCell}>{props.locationCode}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Name</Text>
        <Text style={styles.dataCell}>{props.billtocp}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Contact Name</Text>
        <Text style={styles.dataCell}>{props.billtoname}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Billing Address</Text>
        <Text style={[styles.dataCell, styles.fixedHeightText]}>{props.billToAddress}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>District</Text>
        <Text style={styles.dataCell}>{props.billToDistrict}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>State</Text>
        <Text style={styles.dataCell}>{props.billToState}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Pincode</Text>
        <Text style={styles.dataCell}>{props.billToPinCode}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Phone Number</Text>
        <Text style={styles.dataCell}>{props.billToContact}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Email</Text>
        <Text style={styles.dataCell}>{props.billToEmail}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>GST Number</Text>
        <Text style={styles.dataCell}>{props.billToGstNumber}</Text>
      </View>
    </View>

    <View style={styles.dataTable}>
      <Text style={styles.dataHeader}>Delivery Details</Text>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Location Code</Text>
        <Text style={styles.dataCell}>{props.deliveryLocationCode}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Name</Text>
        <Text style={styles.dataCell}>{props.delcp}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Contact Name</Text>
        <Text style={styles.dataCell}>{props.deliveryName}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Shipping Address</Text>
        <Text style={[styles.dataCell, styles.fixedHeightText]}>{props.shippingAddress}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>District</Text>
        <Text style={styles.dataCell}>{props.deliveryDistrict}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>State</Text>
        <Text style={styles.dataCell}>{props.deliveryState}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Pin Code</Text>
        <Text style={styles.dataCell}>{props.deliveryPinCode}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Phone Number</Text>
        <Text style={styles.dataCell}>{props.deliveryContact}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>Email</Text>
        <Text style={styles.dataCell}>{props.deliveryEmail}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={[styles.dataCell, styles.dataHeader]}>GST Number</Text>
        <Text style={styles.dataCell}>{props.deliveryGstNumber}</Text>
      </View>
    </View>
  </View>

  <View style={styles.footer}>
    <Text style={styles.footerTextBoldUnderline}>GIRIK ENTERPRISES</Text>
    <Text style={styles.footerText}>
      736A/5, PATEL NAGAR, JHARSA ROAD, POLICE LINE, BACK GATE, GURGAON, HARYANA 122006
    </Text>
  </View>
  <View style={styles.section}>
          <Text style={styles.texthead}>Subject:</Text>
          <Text style={styles.text}>{props.topsection}</Text>
  </View>
</Page>

      {renderItemsTable()}
      <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>GIRIK ENTERPRISES</Text>
          <Text style={styles.headerText}>
            Email id:- girik.enterprices24@gmail.com | Contact number:- 9560666158
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.texthead]}>Notes:</Text>
          <Text style={styles.text}>{props.Notes}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTextBoldUnderline}>GIRIK ENTERPRISES</Text>
          <Text style={styles.footerText}>736A/5, PATEL NAGAR, JHARSA ROAD, POLICE LINE, BACK GATE, GURGAON, HARYANA 122006</Text>
        </View>
        </Page>
        <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>GIRIK ENTERPRISES</Text>
          <Text style={styles.headerText}>
            Email id:- girik.enterprices24@gmail.com | Contact number:- 9560666158
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.texthead]}>Terms and Conditions</Text>
          <Text style={styles.text}>{props.tnc}</Text>
        </View>
        {props.signature && (
          <View style={styles.signatureWrapper}>
            <Image style={styles.signature} src={props.signature ? `http://13.234.47.87:5000${props.signature}` : ''} />
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerTextBoldUnderline}>GIRIK ENTERPRISES</Text>
          <Text style={styles.footerText}>736A/5, PATEL NAGAR, JHARSA ROAD, POLICE LINE, BACK GATE, GURGAON, HARYANA 122006</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProjectOrderPDF;
