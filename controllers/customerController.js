const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
const Product = require('../models/Product');

const getItemProductId = (item) => {
  if (!item?.product) return null;
  return item.product._id ? item.product._id.toString() : item.product.toString();
};
3
const isValidCartItem = (item) => item?.product && typeof item.product.price === 'number';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.product');
  }
  return cart;
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate('products');
  }
  return wishlist;
};

const cartPage = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const validItems = cart.items.filter(isValidCartItem);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems.map((item) => ({ product: item.product._id || item.product, quantity: item.quantity }));
    await cart.save();
  }

  const total = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return res.render('customer/cart', {
    title: 'Cart',
    cart: { ...cart.toObject(), items: validItems },
    total,
    error: req.query.error || null,
  });
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.redirect('/products');

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((item) => getItemProductId(item) === productId);
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  if (existing) {
    existing.quantity += safeQuantity;
  } else {
    cart.items.push({ product: productId, quantity: safeQuantity });
  }
  await cart.save();
  return res.redirect('/customer/cart');
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const safeQuantity = Math.max(1, Number(quantity) || 1);

  cart.items = cart.items
    .map((item) => {
      if (getItemProductId(item) === productId) {
        return { ...item.toObject(), quantity: safeQuantity };
      }
      return item;
    })
    .filter((item) => item.quantity > 0 && getItemProductId(item));

  await cart.save();
  return res.redirect('/customer/cart');
};

const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => getItemProductId(item) !== productId);
  await cart.save();
  return res.redirect('/customer/cart');
};

const wishlistPage = async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  return res.render('customer/wishlist', { title: 'Wishlist', wishlist });
};

const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.redirect('/products');
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.redirect('/products');
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.products.some((id) => {
    const value = id?._id ? id._id.toString() : id.toString();
    return value === productId;
  });

  if (exists) {
    wishlist.products = wishlist.products.filter((id) => {
      const value = id?._id ? id._id.toString() : id.toString();
      return value !== productId;
    });
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  return res.redirect('/customer/wishlist');
};

const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  if (!cart.items.length) {
    return res.redirect('/customer/cart');
  }

  const populatedCart = await Cart.findById(cart._id).populate('items.product');
  const validCartItems = populatedCart.items.filter(isValidCartItem);

  if (validCartItems.length !== populatedCart.items.length) {
    populatedCart.items = validCartItems.map((item) => ({ product: item.product._id, quantity: item.quantity }));
    await populatedCart.save();
  }

  const items = validCartItems.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    stock: item.product.stock,
  }));

  if (!items.length) {
    const message = encodeURIComponent('Some items were unavailable and removed from cart.');
    return res.redirect(`/customer/cart?error=${message}`);
  }

  for (const item of items) {
    if (item.quantity > item.stock) {
      const message = encodeURIComponent(`Insufficient stock for ${item.name}`);
      return res.redirect(`/customer/cart?error=${message}`);
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await Order.create({ user: req.user._id, items, totalAmount, shippingAddress, stockDeducted: false });

  populatedCart.items = [];
  await populatedCart.save();

  return res.redirect('/customer/orders');
};

const ordersPage = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.render('customer/orders', { title: 'Orders', orders });
};

const apiMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.auth.id }).sort({ createdAt: -1 });
  return res.json(orders);
};

module.exports = {
  cartPage,
  addToCart,
  updateCartItem,
  removeCartItem,
  wishlistPage,
  toggleWishlist,
  placeOrder,
  ordersPage,
  apiMyOrders,
};
