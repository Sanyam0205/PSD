Project Order Creation Tool

This tool allows users to create, manage, and generate PDFs for project orders with multiple items and subitems. It includes functionality to add, edit, and delete orders, while maintaining a dynamic list of products and pricing details. The application is built using React for the frontend and communicates with a backend API for data persistence and retrieval.

Features

	•	Create Project Orders: Users can create new project orders by adding items and subitems.
	•	Item Management: Add, edit, or remove items and subitems, including their quantity, price, and total calculations.
	•	Dynamic Calculation: Automatically calculates and formats quantities, prices, and totals in a user-friendly format.
	•	PDF Generation: Generate a PDF version of the project order for download or sharing.
	•	Validation: Input validation ensures that fields like quantity and price contain valid data.
	•	Responsive Design: Optimized for different screen sizes, making the tool usable on both desktop and mobile devices.

Technologies Used

	•	Frontend: React (JavaScript)
	•	Backend: Express (Node.js)
	•	State Management: React’s useState and useEffect hooks for handling form data.
	•	PDF Generation: The tool integrates libraries like html2pdf.js or similar for generating downloadable PDFs.
	•	API Requests: Axios for handling API calls to the backend for order data management.
	•	CSS: Styled-components or standard CSS for a responsive layout.

Getting Started

Prerequisites

Ensure you have the following installed:

	•	Node.js (v12 or later)
	•	npm or yarn

Installation

	1.	Clone the repository:

[git clone https://github.com/yourusername/project-order-creation-tool.git](https://github.com/Sanyam0205/PSD.git)


	2.	Navigate to the project directory:

cd project-order-creation-tool


	3.	Install the dependencies:

npm install

Or, if you are using yarn:

yarn install



Running the Application

To run the application locally:

	1.	Start the React frontend:

npm start

This will run the app in development mode. Open http://localhost:3000 to view it in the browser.

	2.	Ensure your backend server is running to handle API requests. The backend should be started separately if applicable.

Building for Production

To build the app for production:

npm run build

This command bundles the application for production, optimizing for best performance. The output will be placed in the build/ folder.

Code Structure

	•	src/components: Contains React components like ProjectOrderPDF, ItemTable, and Form.
	•	src/utils: Utility functions for handling common tasks, such as formatNumber for formatting numbers with toLocaleString.
	•	src/api: Handles API calls using Axios.
	•	public/: Static assets like index.html and other public files.

Known Issues

	•	Undefined Data: If you encounter the error Cannot read properties of undefined (reading 'toLocaleString'), make sure that you are passing valid numeric values to the formatNumber function. Guard against undefined values using conditional checks before formatting.
	•	Editing Items and Subitems: If items and subitems cannot be edited after being added, ensure that state management and input bindings are correctly implemented in the form components.

Future Enhancements

	•	User Authentication: Implement user authentication and authorization to allow multiple users to create and manage their own orders.
	•	Database Integration: Connect the tool to a database to persist orders beyond the current session.
	•	Advanced PDF Customization: Allow users to customize the appearance of the generated PDF, including adding logos, signatures, etc.
	•	Localization: Support multiple currencies and languages for international users.

Contributing

Contributions are welcome! If you would like to contribute to this project:

	1.	Fork the repository.
	2.	Create a new feature branch (git checkout -b feature/your-feature).
	3.	Commit your changes (git commit -m 'Add your feature').
	4.	Push to the branch (git push origin feature/your-feature).
	5.	Create a pull request.
