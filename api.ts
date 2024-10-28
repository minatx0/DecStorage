import axios from 'axios';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const CONTRACT_ABI: AbiItem[] = JSON.parse(process.env.CONTRACT_ABI || '');
const CONTRACT_ADDRESS: string = process.env.CONTRACT_ADDRESS || '';
const WEB3_PROVIDER: string = process.env.WEB3_PROVIDER || '';

class ApiService {
  private web3: Web3;
  private contract: any;

  constructor() {
    this.initWeb3();
    this.initContract();
  }

  private initWeb3(): void {
    this.web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
  }

  private initContract(): void {
    this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  }

  async getDataFromContract(methodName: string, params: any[] = []): Promise<any> {
    try {
      return await this.callContractMethod(methodName, params);
    } catch (error) {
      console.error('Error getting data from contract:', error);
      throw error;
    }
  }

  private async callContractMethod(methodName: string, params: any[]): Promise<any> {
    return this.contract.methods[methodName](...params).call();
  }

  async sendDataToContract(methodName: string, params: any[], fromAddress: string, privateKey: string): Promise<any> {
    try {
      const transaction = this.contract.methods[methodName](...params);
      const options = await this.getTransactionOptions(transaction, fromAddress);
      const signed = await this.signTransaction(options, privateKey);
      return this.sendSignedTransaction(signed.rawTransaction!);
    } catch (error) {
      console.error('Error sending data to contract:', error);
      throw error;
    }
  }

  private async getTransactionOptions(transaction: any, fromAddress: string): Promise<any> {
    return {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: await transaction.estimateGas({ from: fromAddress }),
    };
  }

  private async signTransaction(options: any, privateKey: string): Promise<any> {
    return this.web3.eth.accounts.signTransaction(options, privateKey);
  }

  private async sendSignedTransaction(signedTransactionData: string): Promise<any> {
    return this.web3.eth.sendSignedTransaction(signedTransactionData);
  }

  async interactWithBackend(endpoint: string, method: 'GET' | 'POST' = 'GET', data: any = null): Promise<any> {
    try {
      return await this.requestBackend(endpoint, method, data);
    } catch (error) {
      console.error('Error interacting with backend:', error);
      throw error;
    }
  }

  private async requestBackend(endpoint: string, method: 'GET' | 'POST', data: any): Promise<any> {
    const apiUrl = process.env.BACKEND_API_URL || '';
    const url = `${apiUrl}/${endpoint}`;

    if (method === 'GET') {
      return (await axios.get(url)).data;
    } else {
      return (await axios.post(url, data)).data;
    }
  }
}

export default new ApiService();