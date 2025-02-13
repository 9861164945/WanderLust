const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const dotenv=require('dotenv');
dotenv.config();


const MONGO_URL = process.env.MONGODB_URI;
main()
  .then(() => {
    console.log("connected to DB");
    return initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data.map((obj)=>{
    ({...obj,owner:"670fafda05a42c35de9ee37d"});
  })
  await Listing.insertMany(initData.data);
  console.log("data is initialized");
};

initDB();