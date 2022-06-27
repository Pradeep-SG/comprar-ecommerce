import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import SigninScreen from './screens/SigninScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UsersListScreen from './screens/UsersListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import ErrorScreen from './screens/ErrorScreen';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart">
            <Route path=":id" element={<CartScreen />} />
            <Route path="" element={<CartScreen />} />
          </Route>
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/admin/users" element={<UsersListScreen />} />
          <Route path="/admin/users/:id/edit" element={<UserEditScreen />} />
          <Route path="/admin/products" element={<ProductListScreen />} />
          <Route
            path="/admin/products/:id/edit"
            element={<ProductEditScreen />}
          />
          <Route path="/admin/orders" element={<OrderListScreen />} />
          <Route path="*" element={<ErrorScreen />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
