const hre = require("hardhat");

/**
 * Deploy QuantumFidelityOracle contract to Sepolia testnet
 */
async function main() {
  console.log("🚀 Deploying QuantumFidelityOracle to Sepolia testnet...");
  
  // Chainlink ETH/USD Price Feed on Sepolia
  const CHAINLINK_PRICE_FEED_SEPOLIA = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  
  console.log(`Using Chainlink Price Feed: ${CHAINLINK_PRICE_FEED_SEPOLIA}`);
  
  // Get the contract factory
  const QuantumFidelityOracle = await hre.ethers.getContractFactory("QuantumFidelityOracle");
  
  // Deploy the contract
  console.log("Deploying contract...");
  const oracle = await QuantumFidelityOracle.deploy(CHAINLINK_PRICE_FEED_SEPOLIA);
  
  await oracle.waitForDeployment();
  
  const address = await oracle.getAddress();
  console.log(`✅ QuantumFidelityOracle deployed to: ${address}`);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await oracle.deploymentTransaction().wait(5);
  
  console.log("📝 Deployment complete!");
  console.log("\nContract details:");
  console.log(`  Address: ${address}`);
  console.log(`  Chainlink Feed: ${CHAINLINK_PRICE_FEED_SEPOLIA}`);
  console.log(`  Qubit Count: 50`);
  console.log(`  Min Fidelity: 95.00%`);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    chainlinkFeed: CHAINLINK_PRICE_FEED_SEPOLIA,
    deployedAt: new Date().toISOString(),
    deployer: (await hre.ethers.getSigners())[0].address,
  };
  
  fs.writeFileSync(
    'deployments/phase37-deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📄 Deployment info saved to deployments/phase37-deployment.json");
  
  // Verify contract (optional, requires Etherscan API key)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [CHAINLINK_PRICE_FEED_SEPOLIA],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
