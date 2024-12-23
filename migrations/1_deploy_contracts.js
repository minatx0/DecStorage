const fs = require("fs");
const Web3 = require("web3");
require('dotenv').config();
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_PATH = "./DecStorage.sol";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const deployContract = async () => {
  try {
    const source = fs.readFileSync(CONTRACT_PATH, "utf8");
    const compiledContract = JSON.parse(source);
  } catch (error) {
    console.error("Error reading or parsing the contract file:", error);
    throw error; 
  }

  const abi = compiledContract.abi;
  const bytecode = compiledContract.bytecode;

  const contract = new web3.eth.Contract(abi);

  let account;
  try {
    account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  } catch (error) {
    console.error("Error creating an account from the provided private key:", error);
    throw error;
  }

  web3.eth.accounts.wallet.add(account);
  const deployerAddress = account.address;
  
  let gasEstimate;
  try {
    gasEstimate = await contract.deploy({
      data: bytecode,
    }).estimateGas({from: deployerAddress});
  } catch (error) {
    console.error("Error estimating the gas needed for deployment:", error);
    throw error;
  }

  try {
    const contractInstance = await contract.deploy({
      data: bytecode,
    })
    .send({
      from: deployerAddress,
      gas: gasEstimate,
    })
    .on('receipt', (receipt) => {
      console.log(`Contract deployed at address: ${receipt.contractAddress}`);
    });

    console.log('Deployment successful');
    return contractInstance;
  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }
};

deployContract().catch(err => console.error('An error occurred:', err));