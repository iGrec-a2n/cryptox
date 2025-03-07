require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const config = {
  networks: {
    hardhat: {}, // Réseau local Hardhat

    sepolia: {
      url: process.env.INFURA_API_URL || "https://sepolia.infura.io/v3/cbc8948efdd1413aa38eed194d2a1e37",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
  },
  solidity: "0.8.28",
};

module.exports = config;
