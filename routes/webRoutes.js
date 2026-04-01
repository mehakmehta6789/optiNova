const express = require('express');
const { register, login, logout, getProfile, registerValidators, loginValidators } = require('../controllers/authController');
const { listProducts, productDetails } = require('../controllers/productController');
const {
  cartPage,
  addToCart,
  updateCartItem,
  removeCartItem,
  wishlistPage,
  toggleWishlist,
  placeOrder,
  ordersPage,
} = require('../controllers/customerController');
const {
  dashboardPage,
  productsPage,
  createProduct,
  updateProduct,
  deleteProduct,
  categoriesPage,
  createCategory,
  deleteCategory,
  ordersPage: adminOrdersPage,
  updateOrderStatus,
  usersPage,
} = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');
const handleValidation = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Eyeglass Store' });
});

router.get('/register', (req, res) => res.render('pages/register', { title: 'Register', error: null }));
router.post('/register', registerValidators, handleValidation, register);

router.get('/login', (req, res) => res.render('pages/login', { title: 'Login', error: null }));
router.post('/login', loginValidators, handleValidation, login);
router.post('/logout', logout);

router.get('/products', listProducts);
router.get('/products/:id', productDetails);

router.get('/customer/profile', requireAuth, requireRole('customer', 'admin'), getProfile);
router.get('/customer/cart', requireAuth, requireRole('customer'), cartPage);
router.post('/customer/cart', requireAuth, requireRole('customer'), addToCart);
router.post('/customer/cart/update', requireAuth, requireRole('customer'), updateCartItem);
router.post('/customer/cart/remove/:productId', requireAuth, requireRole('customer'), removeCartItem);
router.get('/customer/wishlist', requireAuth, requireRole('customer'), wishlistPage);
router.post('/customer/wishlist/toggle', requireAuth, requireRole('customer'), toggleWishlist);
router.get('/customer/orders', requireAuth, requireRole('customer'), ordersPage);
router.post('/customer/orders/place', requireAuth, requireRole('customer'), placeOrder);

router.get('/admin', requireAuth, requireRole('admin'), dashboardPage);
router.get('/admin/products', requireAuth, requireRole('admin'), productsPage);
router.post('/admin/products', requireAuth, requireRole('admin'), upload.single('image'), createProduct);
router.put('/admin/products/:id', requireAuth, requireRole('admin'), upload.single('image'), updateProduct);
router.delete('/admin/products/:id', requireAuth, requireRole('admin'), deleteProduct);

router.get('/admin/categories', requireAuth, requireRole('admin'), categoriesPage);
router.post('/admin/categories', requireAuth, requireRole('admin'), createCategory);
router.delete('/admin/categories/:id', requireAuth, requireRole('admin'), deleteCategory);

router.get('/admin/orders', requireAuth, requireRole('admin'), adminOrdersPage);
router.post('/admin/orders/:id/status', requireAuth, requireRole('admin'), updateOrderStatus);

router.get('/admin/users', requireAuth, requireRole('admin'), usersPage);

module.exports = router;
