const fs = require("fs");
const Web3 = require("web3");
require("dotenv").config();
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_PATH = "./DecStorage.sol";
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const deployContract = async () => {
  const source = fs.readFileSync(CONTRACT_PATH, "utf8");
  const compiledContract = JSON.parse(source);
  const abi = compiledContract.abi;
  const bytecode = compiledContract.bytecode;
  const contract = new web3.eth.Contract(abi);
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  const deployerAddress = account.address;
  const gasEstimate = await contract.deploy({
    data: bytecode,
  }).estimateGas({from: deployerAddress});
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
  return contractInstance;
};
deployContract()
  .then(() => console.log('Deployment successful'))
  .catch(err => console.error('Deployment error:', err));