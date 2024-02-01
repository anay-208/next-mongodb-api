require("dotenv").config();
const MongoApi = require("next-mongo-api");

const client = new MongoApi(
  process.env.MONGODB_API_ENDPOINT,
  process.env.MONGODB_API_KEY,
  process.env.DATA_SOURCE
);

async function main() {
  const db =  client.db("admins");
    const data = await db.collection("users").findOne().exec();
    console.log(data)
    console.log("Success!")
}

main();
