// Import necessary modules and components
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Context from './context'; // Import the custom context provider
import Base from './components/Base'; // Import the Base component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the main App component
function App() {
  return (
    // Wrap the entire application with the custom context provider
    <Context>
      <BrowserRouter>
        <Routes>
          {/* Define a route that renders the Base component */}
          <Route path="/" element={<Base />} />
        </Routes>
      </BrowserRouter>
      {/* Add a ToastContainer for displaying notifications */}
      <ToastContainer />
    </Context>
  );
}

export default App;
