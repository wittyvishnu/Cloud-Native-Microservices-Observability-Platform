require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const { redisClient } = require('./config/redis');
const { connectRabbitMQ } = require('./config/rabbitmq');
const cors = require('cors');

app.use(cors({ origin: '*' }));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✔ PostgreSQL connected');

    await redisClient.connect();
    console.log('✔ Redis connected');

    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`🚀 DevOpsConnect backend running on http://localhost:${PORT}`);
      console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();