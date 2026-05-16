const { ethers } = require("ethers");
const contractJson = require("../../../blockchain/build/contracts/RentalContract.json");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

const contractAddress =
  contractJson.networks?.["5777"]?.address;

let contract;

const initContract = async () => {
  if (!contract) {

    if (!contractAddress) {
      throw new Error("Contract not deployed on network 5777");
    }

    const signer = await provider.getSigner();

    contract = new ethers.Contract(
      contractAddress,
      contractJson.abi,
      signer
    );
  }
};

// ---- CREATE RENTAL
const createRental = async (tenant, rent, pdfHash) => {
  await initContract();

  const tx = await contract.createRental(
    tenant,
    rent,
    pdfHash
  );

  const receipt = await tx.wait();

  return {
    hash: tx.hash,
    receipt
  };
};

//---- PAY RENT
const payRent = async (rentalId, amount) => {
  await initContract();

  const tx = await contract.payRent(rentalId, {
    value: ethers.parseEther(amount.toString())
  });

  const receipt = await tx.wait();

  return {
    hash: tx.hash,
    receipt
  };
};

// ---GET RENTAL
const getRental = async (id) => {
  await initContract();
  return await contract.rentals(id);
};

module.exports = {
  createRental,
  payRent,
  getRental
};