import { sendMail, SendMailType } from "@/utils/nodemailer";
import rabbit from "./connect";

const sendEmailQueue = "sendEmail_queue";

export async function sendEmailListener() {
  const channel = await rabbit.createChannel();
  await channel.assertQueue(sendEmailQueue, { durable: true });
  await channel.consume(
    sendEmailQueue,
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString()) as SendMailType;
        const sended = await sendMail(data);
        if (sended) channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
  process.on("SIGINT", async () => {
    await channel.close();
  });
}

export async function sendEmailProducer(message: SendMailType) {
  const channel = await rabbit.createChannel();
  await channel.assertQueue(sendEmailQueue, {
    durable: true,
  });
  await channel.sendToQueue(
    sendEmailQueue,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
    }
  );
  await channel.close();
}
