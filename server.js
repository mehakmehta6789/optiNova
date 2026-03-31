const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const connectDB = require('./config/db');
const bootstrapDefaults = require('./utils/bootstrap');
const { loadUser } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const webRoutes = require('./routes/webRoutes');
const apiAuthRoutes = require('./routes/apiAuthRoutes');
const apiProductRoutes = require('./routes/apiProductRoutes');
const apiCustomerRoutes = require('./routes/apiCustomerRoutes');
const apiAdminRoutes = require('./routes/apiAdminRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(loadUser);

app.use(webRoutes);
app.use('/api/auth', apiAuthRoutes);
app.use('/api/products', apiProductRoutes);
app.use('/api/customer', apiCustomerRoutes);
app.use('/api/admin', apiAdminRoutes);

app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Not Found',
    message: 'Page not found',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await bootstrapDefaults();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message || error);
    process.exit(1);
  }
};

start();
