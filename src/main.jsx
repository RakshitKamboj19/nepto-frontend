import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminRoute from "./pages/Admin/AdminRoute";
import UserList from "./pages/Admin/UserList";
import Profile from "./pages/User/Profile";

import CategoryList from "./pages/Admin/CategoryList";

import AllProducts from "./pages/Admin/AllProducts";
import ProductList from "./pages/Admin/ProductList";
import ProductUpdate from "./pages/Admin/ProductUpdate";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import Product from "./pages/Products/Product.jsx";
import SearchResults from "./pages/SearchResults.jsx";

import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import Order from "./pages/Orders/Order.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import MyOrders from "./pages/Orders/MyOrders.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/search/:keyword" element={<SearchResults />} />

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
