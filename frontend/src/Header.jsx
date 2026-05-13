import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/">
          Eyeglass Store
        </NavLink>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          {user ? (
            <>
              <NavLink to="/customer/profile">Profile</NavLink>
              {user.role === 'customer' && (
                <>
                  <NavLink to="/customer/cart">Cart</NavLink>
                  <NavLink to="/customer/wishlist">Wishlist</NavLink>
                  <NavLink to="/customer/orders">Orders</NavLink>
                </>
              )}
              {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              <button className="btn btn-link" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
