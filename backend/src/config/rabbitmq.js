const amqp = require('amqplib');

let connection = null;
let channel = null;

async function connectRabbitMQ() {
  try {
    console.log("🔄 Connecting to RabbitMQ...");

    connection = await amqp.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
      console.error("❌ RabbitMQ connection closed");
    });

    console.log('✔ RabbitMQ connected');

    channel = await connection.createChannel();
    console.log('✔ RabbitMQ channel created');

    const queueName = 'devops_tasks';

    await channel.assertQueue(queueName, {
      durable: true
    });

    console.log(`✔ Queue "${queueName}" is ready`);

  } catch (error) {
    console.error('❌ RabbitMQ Connection Error:', error);
    process.exit(1);
  }
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized!');
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };