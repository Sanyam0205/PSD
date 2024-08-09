import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { toWords } from 'number-to-words'; // Importing from number-to-words
import times from '../assets/Times New Roman.ttf'; // Importing the font file

Font.register({
  family: 'TimesNewRoman',
  src: times,
});

const numberToWords = (num) => {
  if (num === 0) return 'ZERO';

  const underTwenty = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];

  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];

  const scales = [
    '', 'thousand', 'lakh', 'crore'
  ];

  const getBelowHundred = (n) => {
    if (n < 20) {
      return underTwenty[n];
    }
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    return tens[ten] + (unit ? ' ' + underTwenty[unit] : '');
  };

  const getBelowThousand = (n) => {
    if (typeof n !== 'number' || n < 0) {
      console.error("Invalid number passed to getBelowThousand:", n);
      return '';
    }
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    const hundredText = hundred ? underTwenty[hundred] + ' hundred ' : '';
    const restText = rest ? getBelowHundred(rest) : '';
    return (hundredText + restText).trim();
  };

  const getBelowLakh = (n) => {
    const thousand = Math.floor(n / 1000);
    const belowThousand = n % 1000;
    return (thousand ? getBelowThousand(thousand) + ' thousand ' : '') + (belowThousand ? getBelowThousand(belowThousand) : '').trim();
  };

  const getBelowCrore = (n) => {
    const lakh = Math.floor(n / 100000);
    const belowLakh = n % 100000;
    return (lakh ? getBelowLakh(lakh) + ' lakh ' : '') + (belowLakh ? getBelowLakh(belowLakh) : '').trim();
  };

  let result = '';
  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  let belowThousand = remainder % 1000;

  if (crore > 0) {
    result += getBelowCrore(crore) + ' crore ';
  }
  if (lakh > 0) {
    result += getBelowLakh(lakh) + ' lakh ';
  }
  if (thousand > 0) {
    result += getBelowThousand(thousand) + ' thousand ';
  }
  if (belowThousand > 0) {
    result += getBelowThousand(belowThousand);
  }

  return result.trim().toUpperCase();
};

const formatNumber = (value) => {
  return value.toLocaleString('en-IN');
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
    fontFamily:'TimesNewRoman'
  },

  dataHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontFamily:'TimesNewRoman'
  
  },

  DataHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderBottom:1,
    textAlign:'center'
  },

  fixedHeightText: {
    height: 80, // Adjust this height to fit 4 lines
    padding: 2,
    textAlign: 'left',
    fontSize: 10, // Adjust font size as needed
    overflow: 'hidden', // Hide any overflow text
    fontFamily: 'TimesNewRoman',
  },

  fixedhText: {
    height: 40, // Adjust this height to fit 4 lines
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

  wideColumn: {
    width: '100%', // Example width
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

  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    fontSize: 12, // Reduced font size for headers
    fontFamily: 'TimesNewRoman',
    // padding: 1,
    textAlign: 'center',
    borderTop:1
  },


  itemsTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    wordWrap: 'break-word',
    textAlign: 'center',
    fontSize: 9,  // Further reduced font size
  },
  
  itemrow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',  
  },

  tableCell: {
    // padding: '0.5',  // Further reduced padding
    // justifyContent: 'center',
    fontSize: 9,  // Further reduced font size
  },

  tabletext: {
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
    fontSize:11, 

  },

  descriptionColumn: {
    width: '40%',
    textAlign: 'left',    
    fontFamily: 'TimesNewRoman',
    fontSize:11,
    borderRight: 1,
    height: 50,  // Adjusted column width for description
  },
  
  descriptionheadColumn: {
    width: '40%',
    textAlign: 'left',    
    fontFamily: 'TimesNewRoman',
    fontSize:11,
    borderRight: 1,
  },

  smallColumn: {
    width: '7%',
    borderRight: 1  // Smaller width for less important columns
  },

  mediumColumn: {
    width: '10%',
    borderRight: 1  // Slightly wider for important columns like Amount
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
    fontSize: 11, // Reduced font size for amounts
  },

});

const ProjectOrderPDF = (props) => {
  const renderItemsTable = () => {
    // Define a variable to hold all rows including sub-items
    const rows = [];
  
    // Iterate over each item and create rows for items and sub-items
    props.items.forEach((item, index) => {
      const subItemDiscountAmount = item.subItems.reduce(
        (total, subItem) =>
          total +
          (subItem.ratePerUnit * subItem.quantity * subItem.discount) /
            100,
        0
      );
  
      const subItemGSTAmount = item.subItems.reduce(
        (total, subItem) =>
          total +
          ((subItem.ratePerUnit * subItem.quantity -
            (subItem.ratePerUnit * subItem.quantity * subItem.discount) /
              100) *
            subItem.gstPercentage) /
            100,
        0
      );
  
      // Add the main item row to rows array
      rows.push(
        <View style={styles.itemrow} key={`item-${index}`}>
          <Text style={[styles.smallColumn, styles.tabletext]}>
            {item.sno}
          </Text>
          <Text style={[styles.descriptionColumn]}>
            {item.description}
          </Text>
          <Text style={[styles.smallColumn, styles.tabletext]}>
            {item.unit}
          </Text>
          <Text style={[styles.smallColumn, styles.tabletext]}>
            {formatNumber(item.quantity)}
          </Text>
          <Text style={[styles.smallColumn, styles.amttext]}>
   {item.ratePerUnit !== undefined && item.ratePerUnit !== null ? formatNumber(item.ratePerUnit) : 'N/A'}
</Text>
<Text style={[styles.smallColumn, styles.tabletext]}>
   {item.discount !== undefined && item.discount !== null ? formatNumber(item.discount) : 'N/A'}
</Text>
          <Text style={[styles.mediumColumn, styles.amttext]}>
            {formatNumber(subItemDiscountAmount)}{" "}
          </Text>
          <Text style={[styles.smallColumn, styles.tabletext]}>
   {item.gstPercentage !== undefined && item.gstPercentage !== null ? formatNumber(item.gstPercentage) : 'N/A'}
</Text>
          <Text style={[styles.mediumColumn, styles.amttext]}>
            {formatNumber(subItemGSTAmount)} {/* Ensure commas */}
          </Text>
          <Text style={[styles.mediumColumn, styles.amttext]}>
            {formatNumber(item.amount)} {/* Ensure commas */}
          </Text>
        </View>
      );
  
      // Add sub-item rows to the rows array
      item.subItems.forEach((subItem, subIndex) => {
        rows.push(
          <View style={styles.itemrow} key={`${index}-${subIndex}`}>
            <Text style={[styles.smallColumn, styles.tabletext]}>
              {`${item.sno}.${subIndex + 1}`}
            </Text>
            <Text style={[styles.descriptionColumn]}>
              {subItem.description}
            </Text>
            <Text style={[styles.smallColumn, styles.tabletext]}>
              {subItem.unit}
            </Text>
            <Text style={[styles.smallColumn, styles.tabletext]}>
              {formatNumber(subItem.quantity)}
            </Text>
            <Text style={[styles.smallColumn, styles.amttext]}>
              {formatNumber(subItem.ratePerUnit)}{' '}
            </Text>
            <Text style={[styles.smallColumn, styles.tabletext]}>
              {formatNumber(subItem.discount)}
            </Text>
            <Text style={[styles.mediumColumn, styles.amttext]}>
              {formatNumber(
                (subItem.ratePerUnit * subItem.quantity * subItem.discount) /
                  100
              )}
            </Text>
            <Text style={[styles.smallColumn, styles.tabletext]}>
              {formatNumber(subItem.gstPercentage)}
            </Text>
            <Text style={[styles.mediumColumn, styles.amttext]}>
              {formatNumber(
                ((subItem.ratePerUnit * subItem.quantity -
                  (subItem.ratePerUnit * subItem.quantity * subItem.discount) /
                    100) *
                  subItem.gstPercentage) /
                  100
              )}
            </Text>
            <Text style={[styles.mediumColumn, styles.amttext]}>
              {formatNumber(subItem.amount)} {/* Ensure commas */}
            </Text>
          </View>
        );
      });
    });
  
    const rowsPerPage = 8; // Adjust as needed to fit content within page
    const pages = [];
  
    for (let i = 0; i < rows.length; i += rowsPerPage) {
      pages.push(
        <Page key={i} size="A4" orientation="landscape" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>GIRIK ENTERPRISES</Text>
            <Text style={styles.headerText}>
              Email id:- girik.enterprices24@gmail.com | Contact number:-
              9560666158
            </Text>
          </View>

  
          {/* Table Header */}
          <View style={styles.itemsrow}>
            <View style={styles.itemrow}>
              <Text style={[styles.smallColumn, styles.tableHeader]}>
                S.No
              </Text>
              <Text style={[styles.descriptionheadColumn, styles.tableHeader]}>
                Description
              </Text>
              <Text style={[styles.smallColumn, styles.tableHeader]}>
                Unit
              </Text>
              <Text style={[styles.smallColumn, styles.tableHeader]}>
                Qty
              </Text>
              <Text style={[styles.smallColumn, styles.tableHeader]}>
                RPU
              </Text>
              <Text style={[styles.smallColumn, styles.tableHeader]}>
                Disc%
              </Text>
              <Text style={[styles.mediumColumn, styles.tableHeader]}>
                Net Amt
              </Text>
              <Text style={[styles.smallColumn, styles.tableHeader]}>
                GST %
              </Text>
              <Text style={[styles.mediumColumn, styles.tableHeader]}>
                GST Amt
              </Text>
              <Text style={[styles.mediumColumn, styles.tableHeader]}>
                Amount
              </Text>
            </View>
            {/* Table Rows */}
            {rows.slice(i, i + rowsPerPage)}
          </View>
  
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerTextBoldUnderline}>
              GIRIK ENTERPRISES
            </Text>
            <Text style={styles.footerText}>
              736A/5, PATEL NAGAR, JHARSA ROAD, POLICE LINE, BACK GATE,
              GURGAON, HARYANA 122006
            </Text>
          </View>
  
          {/* Total Section on the Last Page */}
          {i + rowsPerPage >= rows.length && (
            <View style={styles.section}>
              <Text style={[styles.texthead]}>
                Total Amount: Rs. {formatNumber(props.totalAmount)}{" "}
              </Text>
              <Text style={[styles.texthead]}>
                Total Amount in Words: Rupees {numberToWords(props.totalAmount)}
              </Text>
              <Text style={[styles.textalign]}>
                ------------------Intentionally Left Blank------------------
              </Text>
            </View>
          )}
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
  
  <View style={styles.headerRight}>
    <Text style={styles.text}>PO Number: {props.poNumber}</Text>
    <Text style={styles.text}>PO Date: {props.poDate}</Text>
    <Text style={styles.text}>
      Delivery Date: {props.podeliveryDate}
    </Text>
  </View>

  <View style={styles.tableWrapper}>
    <View style={styles.dataTable}>
      <Text style={styles.DataHeader}>Vendor Details</Text>
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
        <Text style={[styles.dataCell, styles.fixedhText]}>{props.contactperson}</Text>
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
      <Text style={styles.DataHeader}>Billing Details</Text>
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
        <Text style={[styles.dataCell, styles.fixedhText]}>{props.billtoname}</Text>
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
      <Text style={styles.DataHeader}>Delivery Details</Text>
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
        <Text style={[styles.dataCell, styles.fixedhText]}>{props.deliveryName}</Text>
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
