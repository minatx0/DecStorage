import { ethers } from "ethers";
import { Contract, Wallet } from "ethers";
import dotenv from 'dotenv';
dotenv.config();
interface Env {
  ALCHEMY_API_URL: string;
  WALLET_PRIVATE_KEY: string;
  CONTRACT_ADDRESS: string;
  CONTRACT_ABI: any;
}
const getEnvVars = (): Env => {
  const { ALCHEMY_API_URL, WALLET_PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ABI } = process.env;
  if (!ALCHEMY_API_URL || !WALLET_PRIVATE_KEY || !CONTRACT_ADDRESS || !CONTRACT_ABI) {
    throw new Error("Missing environment variables");
  }
  return {
    ALCHEMY_API_URL,
    WALLET_PRIVATE_KEY,
    CONTRACT_ADDRESS,
    CONTRACT_ABI: JSON.parse(CONTRACT_ABI),
  };
}
class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: Wallet;
  private contract: Contract;
  private env: Env;
  constructor() {
    this.env = getEnvVars();
    this.provider = new ethers.providers.JsonRpcProvider(this.env.ALCHEMY_API_URL);
    this.wallet = new ethers.Wallet(this.env.WALLET_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(this.env.CONTRACT_ADDRESS, this.env.CONTRACT_ABI, this.wallet);
  }
  async getWalletBalance() {
    const balance: ethers.BigNumber = await this.wallet.getBalance();
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
    return balance;
  }
  async callContractMethod(methodName: string, ...args: any[]) {
    try {
      const method = this.contract[methodName];
      if (!method) {
        throw Error(`Method ${methodName} not found in contract.`);
      }
      const tx = await method(...args);
      await tx.wait();
      console.log(`Transaction successful with hash: ${tx.hash}`);
    } catch (error) {
      console.error(`Error calling ${methodName} on contract: ${error}`);
    }
  }
}
(async () => {
  const blockchainService = new BlockchainService();
  await blockchainService.getWalletBalance();
  await blockchainService.callContractMethod("exampleMethodName", arg1, arg2);
})();