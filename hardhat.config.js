require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: 'dhfoDgvulfnTUtnIf'
          }
        }
      },
      viaIR: true
    }
  },
  networks: {
    somnia: {
      url: "https://dream-rpc.somnia.network",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""], // Use a .env file to keep your PK secret
      chainId: 50312,
      gasPrice: 50000000000,
      timeout: 200000
    },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://localhost:8545",
    }
  },
  etherscan: {
    apiKey: {
      somnia: "empty"
    },
    customChains: [
      {
        network: "somnia",
        chainId: 50312,
        urls: {
          apiURL: "https://shannon-explorer.somnia.network/api",
          browserURL: "https://shannon-explorer.somnia.network"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 60000
  }
};
