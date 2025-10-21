const { ethers } = require("hardhat");

async function main() {
  const UTILITY_TOKEN_ADDRESS = "0x8270bc03a46ADC2b21EAB599cF077Ce16Af9f5cb";
  
  console.log("Deploying TokenFaucet...");
  console.log("Utility Token Address:", UTILITY_TOKEN_ADDRESS);
  
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(UTILITY_TOKEN_ADDRESS);
  
  await faucet.waitForDeployment();
  
  const faucetAddress = await faucet.getAddress();
  
  console.log("✅ TokenFaucet deployed to:", faucetAddress);
  console.log("📋 Add this to your .env file:");
  console.log(`NEXT_PUBLIC_FAUCET_ADDRESS="${faucetAddress}"`);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const tokenAddress = await faucet.token();
  console.log("Token address from faucet:", tokenAddress);
  
  if (tokenAddress.toLowerCase() === UTILITY_TOKEN_ADDRESS.toLowerCase()) {
    console.log("✅ Faucet correctly linked to Utility Token");
  } else {
    console.log("❌ Token address mismatch!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
