import amqplib, { type Connection } from "amqplib";
let conn: Connection;

async function connect(url: string) {
  try {
    conn = await amqplib.connect(url);
    process.once("SIGINT", async () => {
      await conn.close();
    });
  } catch (error: unknown) {
    throw new Error(`Connection to the RabbitMQ cluster failed: ${error}`);
  }
}

function createChannel() {
  if (!conn) throw new Error("Create to the RabbitMQ cluster failed");
  return conn.createChannel();
}

export default {
  connect,
  createChannel,
};
