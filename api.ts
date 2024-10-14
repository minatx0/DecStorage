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
    this.web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
    this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  }

  async getDataFromContract(methodName: string, params: any[] = []): Promise<any> {
    try {
      const data = await this.contract.methods[methodName](...params).call();
      return data;
    } catch (error) {
      console.error('Error getting data from contract:', error);
      throw error;
    }
  }

  async sendDataToContract(methodName: string, params: any[], fromAddress: string, privateKey: string): Promise<any> {
    const transaction = this.contract.methods[methodName](...params);
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: await transaction.estimateGas({ from: fromAddress })
    };

    const signed = await this.web3.eth.accounts.signTransaction(options, privateKey);
    return this.web3.eth.sendSignedTransaction(signed.rawTransaction!);
  }

  async interactWithBackend(endpoint: string, method: 'GET' | 'POST' = 'GET', data: any = null): Promise<any> {
    const apiUrl = process.env.BACKEND_API_URL || '';
    try {
      const res = method === 'GET' ? 
        await axios.get(`${apiUrl}/${endpoint}`) : 
        await axios.post(`${apiUrl}/${endpoint}`, data);

      return res.data;
    } catch (error) {
      console.error('Error interacting with backend:', error);
      throw error;
    }
  }
}

export default new ApiService();