const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Message = require("./models/Message");

const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/push_pull";
mongoose.connect(mongoURL);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/messages", async (req, res) => {
  const { body } = req;
  const message = await Message.create(body);
  res.json(message);
});

// clear the database
app.delete("/messages", async (req, res) => {
  await Message.deleteMany().exec();
  res.json({ status: "ok" });
});

app.get("/messages", async (req, res) => {
  // get the newly created messages after the last message id else get all messages
  const { id } = req.query;
  const query = id ? { _id: { $gt: id } } : {};
  const messages = await Message.find(query).exec();
  res.json(messages);
});

const subscribers = {};

app.get("/long/messages", (req, res) => {
  const id = Math.ceil(Math.random() * 100000);
  req.on("close", () => {
    delete subscribers[id];
  });
  subscribers[id] = res;
});

app.post("/long/messages", async (req, res) => {
  const { body } = req;
  // save to db
  const savedMessages = await Message.create(body);
  Object.keys(subscribers).forEach((id) => {
    subscribers[id].json(savedMessages);
  });
  res.json({ status: "ok" });
});

const sseSubs = {};

app.get("/sse/messages", (req, res) => {
  const id = Math.ceil(Math.random() * 100000);
  req.on("close", () => {
    delete sseSubs[id];
  });
  sseSubs[id] = res;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
});

app.post("/sse/messages", async (req, res) => {
  const { body } = req;
  const savedMessages = await Message.create(body);
  Object.keys(sseSubs).forEach((id) => {
    sseSubs[id].write(`data: ${JSON.stringify(savedMessages)}\n\n`);
  });
  res.json({ status: "ok" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
