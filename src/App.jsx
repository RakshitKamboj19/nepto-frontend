import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      {/* Use Header instead of Navigation */}
      <Header />
      {/* Add padding-top to account for fixed header and search bar */}
      <main className="pt-32 pb-6 px-3">
        <Outlet />
      </main>
    </>  
  );
};

export default App;
