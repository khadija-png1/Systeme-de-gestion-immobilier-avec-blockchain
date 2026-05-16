const { ethers } = require("ethers");
const provider = require("./provider");

// 🔵 Import du contrat compilé par Truffle
const contractJson = require("../../../blockchain/build/contracts/RentalContract.json");

// 🔵 Récupération automatique de l’adresse (GANACHE = 5777)
const networkId = "5777";

const contractAddress = contractJson.networks[networkId]?.address;

if (!contractAddress) {
  throw new Error("Contract not deployed on this network. Run truffle migrate first.");
}

// 🔵 Création instance du smart contract
const contract = new ethers.Contract(
  contractAddress,
  contractJson.abi,
  provider
);

module.exports = contract;