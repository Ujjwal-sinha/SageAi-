const { ethers } = require("hardhat");

async function main() {
  // Get deployer account and info
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Show account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Contract configuration
  const initialSupply = ethers.parseUnits("1000000", 18); // 1 million tokens with 18 decimals
  const contractName = "UtilityToken";

  // Deploy the contract
  console.log(`Deploying ${contractName}...`);
  const UtilityToken = await ethers.getContractFactory(contractName);
  const utilityToken = await UtilityToken.deploy(initialSupply);
  await utilityToken.waitForDeployment();

  // Get deployment info
  const address = await utilityToken.getAddress();
  const txHash = utilityToken.deploymentTransaction()?.hash;

  console.log(`${contractName} deployed to:`, address);
  console.log("Transaction hash:", txHash);

  // Verify deployment
  console.log("Verifying deployment...");
  console.log("Token name:", await utilityToken.name());
  console.log("Token symbol:", await utilityToken.symbol());
  console.log("Total supply:", ethers.formatEther(await utilityToken.totalSupply()), "UTK");
  console.log("Owner address:", await utilityToken.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });