const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuantumFidelityOracle", function () {
  let oracle;
  let owner;
  let verifier;
  let user;
  let chainlinkFeedAddress;

  beforeEach(async function () {
    // Get signers
    [owner, verifier, user] = await ethers.getSigners();

    // Mock Chainlink Price Feed address (Sepolia ETH/USD)
    chainlinkFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

    // Deploy contract
    const QuantumFidelityOracle = await ethers.getContractFactory("QuantumFidelityOracle");
    oracle = await QuantumFidelityOracle.deploy(chainlinkFeedAddress);
    await oracle.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await oracle.owner()).to.equal(owner.address);
    });

    it("Should set the correct Chainlink feed", async function () {
      expect(await oracle.chainlinkPriceFeed()).to.equal(chainlinkFeedAddress);
    });

    it("Should authorize owner as verifier", async function () {
      expect(await oracle.authorizedVerifiers(owner.address)).to.be.true;
    });

    it("Should have correct qubit count", async function () {
      expect(await oracle.QUBIT_COUNT()).to.equal(50);
    });

    it("Should have correct minimum fidelity threshold", async function () {
      expect(await oracle.MIN_FIDELITY_THRESHOLD()).to.equal(9500);
    });
  });

  describe("Verifier Management", function () {
    it("Should allow owner to authorize verifier", async function () {
      await oracle.setVerifierAuthorization(verifier.address, true);
      expect(await oracle.authorizedVerifiers(verifier.address)).to.be.true;
    });

    it("Should allow owner to revoke verifier", async function () {
      await oracle.setVerifierAuthorization(verifier.address, true);
      await oracle.setVerifierAuthorization(verifier.address, false);
      expect(await oracle.authorizedVerifiers(verifier.address)).to.be.false;
    });

    it("Should revert if non-owner tries to authorize verifier", async function () {
      await expect(
        oracle.connect(user).setVerifierAuthorization(verifier.address, true)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should emit VerifierAuthorized event", async function () {
      await expect(oracle.setVerifierAuthorization(verifier.address, true))
        .to.emit(oracle, "VerifierAuthorized")
        .withArgs(verifier.address, true);
    });
  });

  describe("Proof Submission", function () {
    beforeEach(async function () {
      await oracle.setVerifierAuthorization(verifier.address, true);
    });

    it("Should allow authorized verifier to submit proof", async function () {
      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650; // 96.5%
      const signature = ethers.toUtf8Bytes("test-signature");

      await expect(
        oracle.connect(verifier).submitFidelityProof(tensorHash, fidelityScore, signature)
      ).to.emit(oracle, "ProofSubmitted");
    });

    it("Should revert if unauthorized user tries to submit proof", async function () {
      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650;
      const signature = ethers.toUtf8Bytes("test-signature");

      await expect(
        oracle.connect(user).submitFidelityProof(tensorHash, fidelityScore, signature)
      ).to.be.revertedWith("Not an authorized verifier");
    });

    it("Should revert if fidelity score is invalid", async function () {
      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 10001; // > 100%
      const signature = ethers.toUtf8Bytes("test-signature");

      await expect(
        oracle.connect(verifier).submitFidelityProof(tensorHash, fidelityScore, signature)
      ).to.be.revertedWith("Invalid fidelity score");
    });

    it("Should revert if tensor hash is zero", async function () {
      const tensorHash = ethers.ZeroHash;
      const fidelityScore = 9650;
      const signature = ethers.toUtf8Bytes("test-signature");

      await expect(
        oracle.connect(verifier).submitFidelityProof(tensorHash, fidelityScore, signature)
      ).to.be.revertedWith("Invalid tensor hash");
    });

    it("Should revert if signature is empty", async function () {
      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650;
      const signature = "0x";

      await expect(
        oracle.connect(verifier).submitFidelityProof(tensorHash, fidelityScore, signature)
      ).to.be.revertedWith("Signature required");
    });

    it("Should store proof with correct details", async function () {
      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650;
      const signature = ethers.toUtf8Bytes("test-signature");

      const tx = await oracle.connect(verifier).submitFidelityProof(
        tensorHash,
        fidelityScore,
        signature
      );
      const receipt = await tx.wait();

      // Extract proof ID from event
      const event = receipt.logs.find(
        (log) => oracle.interface.parseLog(log)?.name === "ProofSubmitted"
      );
      const proofId = oracle.interface.parseLog(event).args[0];

      const proof = await oracle.getProof(proofId);
      expect(proof.tensorHash).to.equal(tensorHash);
      expect(proof.fidelityScore).to.equal(fidelityScore);
      expect(proof.verifier).to.equal(verifier.address);
      expect(proof.verified).to.be.false;
      expect(proof.qubitCount).to.equal(50);
    });
  });

  describe("Proof Verification", function () {
    let proofId;

    beforeEach(async function () {
      await oracle.setVerifierAuthorization(verifier.address, true);

      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650;
      const signature = ethers.toUtf8Bytes("test-signature");

      const tx = await oracle.connect(verifier).submitFidelityProof(
        tensorHash,
        fidelityScore,
        signature
      );
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (log) => oracle.interface.parseLog(log)?.name === "ProofSubmitted"
      );
      proofId = oracle.interface.parseLog(event).args[0];
    });

    it("Should allow authorized verifier to verify proof", async function () {
      await expect(oracle.connect(verifier).verifyFidelityProof(proofId))
        .to.emit(oracle, "ProofVerified")
        .withArgs(proofId, true, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));
    });

    it("Should mark proof as verified", async function () {
      await oracle.connect(verifier).verifyFidelityProof(proofId);
      const proof = await oracle.getProof(proofId);
      expect(proof.verified).to.be.true;
    });

    it("Should revert if proof already verified", async function () {
      await oracle.connect(verifier).verifyFidelityProof(proofId);
      await expect(
        oracle.connect(verifier).verifyFidelityProof(proofId)
      ).to.be.revertedWith("Proof already verified");
    });

    it("Should revert if unauthorized user tries to verify", async function () {
      await expect(
        oracle.connect(user).verifyFidelityProof(proofId)
      ).to.be.revertedWith("Not an authorized verifier");
    });
  });

  describe("Proof Validation", function () {
    it("Should return true for valid verified proof", async function () {
      await oracle.setVerifierAuthorization(verifier.address, true);

      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650;
      const signature = ethers.toUtf8Bytes("test-signature");

      const tx = await oracle.connect(verifier).submitFidelityProof(
        tensorHash,
        fidelityScore,
        signature
      );
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (log) => oracle.interface.parseLog(log)?.name === "ProofSubmitted"
      );
      const proofId = oracle.interface.parseLog(event).args[0];

      await oracle.connect(verifier).verifyFidelityProof(proofId);

      expect(await oracle.isProofValid(proofId)).to.be.true;
    });

    it("Should return false for non-existent proof", async function () {
      const fakeProofId = ethers.id("fake-proof");
      expect(await oracle.isProofValid(fakeProofId)).to.be.false;
    });
  });

  describe("Contract Management", function () {
    it("Should allow owner to pause contract", async function () {
      await oracle.setPaused(true);
      expect(await oracle.paused()).to.be.true;
    });

    it("Should prevent operations when paused", async function () {
      await oracle.setVerifierAuthorization(verifier.address, true);
      await oracle.setPaused(true);

      const tensorHash = ethers.id("test-tensor-state");
      const fidelityScore = 9650;
      const signature = ethers.toUtf8Bytes("test-signature");

      await expect(
        oracle.connect(verifier).submitFidelityProof(tensorHash, fidelityScore, signature)
      ).to.be.revertedWith("Contract is paused");
    });

    it("Should allow owner to transfer ownership", async function () {
      await oracle.transferOwnership(user.address);
      expect(await oracle.owner()).to.equal(user.address);
    });

    it("Should allow owner to update Chainlink feed", async function () {
      const newFeed = "0x1234567890123456789012345678901234567890";
      await expect(oracle.updateChainlinkFeed(newFeed))
        .to.emit(oracle, "ChainlinkFeedUpdated")
        .withArgs(chainlinkFeedAddress, newFeed);
    });
  });
});
