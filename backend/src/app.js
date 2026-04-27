const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { metricsMiddleware, metricsHandler } = require('./config/prom'); 

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const feedRoutes = require('./routes/feed');
const notificationRoutes = require('./routes/notifications');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 ADD METRICS MIDDLEWARE (before routes)
app.use(metricsMiddleware);

app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/notifications', notificationRoutes);

// 🔥 Prometheus endpoint
app.get('/metrics', metricsHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DevOpsConnect API' });
});

app.use(errorHandler);

module.exports = app;