const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj,
        owner:"669a480e426388c70c98d503",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();