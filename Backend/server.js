require("dotenv").config();
const { config } = require("dotenv");
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const dns = require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");


connectToDB();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})