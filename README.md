# DecStorage - Decentralized File Storage System

**DecStorage** is a decentralized platform that allows users to securely store and manage files using blockchain technology. The platform ensures redundancy, high availability, and data integrity by distributing files across multiple nodes in a decentralized network.

## Features

- **Decentralized Storage**: Files are stored across a distributed network of nodes, ensuring no single point of failure.
- **Smart Contracts**: Solidity-based contracts manage file storage, access permissions, and redundancy.
- **User-Friendly Interface**: A React-based frontend allows users to easily upload, view, and manage files.
- **Blockchain Integration**: All storage operations are recorded on the blockchain, ensuring transparency and security.

## Architecture

The project is divided into three main components:

1. **Smart Contracts**: Written in Solidity, these contracts handle the logic for storing and managing files.
2. **Client Application**: Built with JavaScript and TypeScript using React, this is the frontend interface for interacting with the storage system.
3. **Scripts**: JavaScript scripts for automating the deployment of smart contracts and interacting with them.

## Installation

### Prerequisites

- **Node.js** and **npm**: Install from [Node.js official website](https://nodejs.org/).
- **Truffle**: Install globally using npm:
  ```bash
  npm install -g truffle
  ```
- **Ganache**: For local Ethereum blockchain development. Download from [Ganache official website](https://www.trufflesuite.com/ganache).
- **Metamask**: Browser extension for managing Ethereum accounts.

### Clone the Repository

```bash
git clone https://github.com/yourusername/decstorage.git
cd decstorage
```

### Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Smart Contracts

```bash
cd ..
truffle compile
```

## Usage

### Running the Local Blockchain

Start a local blockchain using Ganache:

```bash
ganache-cli
```

### Deploying Smart Contracts

Deploy the smart contracts to the local blockchain:

```bash
truffle migrate --network development
```

### Running the Client Application

```bash
cd client
npm start
```

The application should now be running on `http://localhost:3000`.

## Smart Contracts

- **DecStorage.sol**: The main contract that handles the logic for file storage, access permissions, and redundancy across nodes.

### Deployment

Deployment is handled by Truffle, and the contract is automatically deployed using the migration scripts provided.

## Client Application

The frontend of DecStorage is built with React and TypeScript. It allows users to:

- Upload files to the decentralized storage network.
- View a list of stored files and manage access permissions.
- Download or share files directly from the decentralized network.

### Main Components

- **UploadFile.tsx**: Upload files to the decentralized storage.
- **FileList.tsx**: Display and manage stored files.
- **api.ts**: Handle API requests to the backend and smart contracts.
- **blockchain.ts**: Manage blockchain interactions.

## Scripts

### Deployment Script

- **deploy.js**: Automates the deployment of smart contracts to the blockchain.

### Interaction Script

- **interact.js**: Allows interaction with deployed smart contracts, such as uploading and retrieving files.
