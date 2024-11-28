import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentVariables {
  ALCHEMY_API_URL: string;
  WALLET_PRIVATE_KEY: string;
  CONTRACT_ADDRESS: string;
  CONTRACT_ABI: any;
}

const loadEnvironmentVariables = (): EnvironmentVariables => {
  const { ALCHEMY_API_URL, WALLET_PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ABI } = process.env;
  
  if (!ALCHEMY_API_URL || !WALLET_PRIVATE_KEY || !CONTRACT_ADDRESS || !CONTRACT_ABI) {
    throw new Error("One or more required environment variables are missing.");
  }
  
  return {
    ALCHEMY_API_URL,
    WALLET_PRIVATE_KEY,
    CONTRACT_ADDRESS,
    CONTRACT_ABI: JSON.parse(CONTRACT_ABI),
  };
}

class DecentralizedStorageService {
  private blockchainProvider: ethers.providers.JsonRpcProvider;
  private userWallet: ethers.Wallet;
  private smartContract: ethers.Contract;
  private envVars: EnvironmentVariables;
  
  constructor() {
    this.envVars = loadEnvironmentVariables();
    this.blockchainProvider = new ethers.providers.JsonRpcProvider(this.envVars.ALCHEMY_API_URL);
    this.userWallet = new ethers.Wallet(this.envVars.WALLET_PRIVATE_KEY, this.blockchainProvider);
    this.smartContract = new ethers.Contract(this.envVars.CONTRACT_ADDRESS, this.envVars.CONTRACT_ABI, this.userWallet);
  }
  
  async displayWalletBalance() {
    const balance: ethers.BigNumber = await this.userWallet.getBalance();
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
    return balance;
  }
  
  async executeContractMethod(methodName: string, ...params: any[]) {
    try {
      if (typeof this.smartContract[methodName] !== 'function') {
        throw new Error(`Method "${methodName}" not found in the contract.`);
      }
      
      const transactionResponse = await this.smartContract[methodName](...params);
      const transactionReceipt = await transactionResponse.wait();
      console.log(`Transaction successful with hash: ${transactionReceipt.transactionHash}`);
    } catch (error) {
      console.error(`An error occurred executing "${methodName}" on the contract: ${error}`);
    }
  }
}

(async () => {
  const decentralizedStorageService = new DecentralizedStorageService();
  await decentralizedStorageService.displayWalletBalance();
  await decentralizedStorageService.executeContractMethod("exampleMethodName", "arg1", "arg2");
})();