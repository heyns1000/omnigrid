// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title QuantumFidelityOracle
 * @notice Blockchain oracle for verifying 50-qubit fidelity proofs
 * @dev Implements decentralized verification with Chainlink integration for Phase 37
 */
contract QuantumFidelityOracle {
    // Constants
    uint8 public constant QUBIT_COUNT = 50;
    uint256 public constant MIN_FIDELITY_THRESHOLD = 9500; // 95.00% in basis points
    uint256 public constant PROOF_VALIDITY_PERIOD = 1 hours;
    
    // State variables
    address public owner;
    AggregatorV3Interface public chainlinkPriceFeed;
    bool public paused;
    
    // Structs
    struct FidelityProof {
        uint256 timestamp;
        uint256 fidelityScore; // In basis points (10000 = 100%)
        bytes32 tensorHash;
        address verifier;
        bool verified;
        uint8 qubitCount;
        bytes signature;
    }
    
    struct QubitState {
        uint256 realComponent;
        uint256 imagComponent;
        uint8 qubitIndex;
    }
    
    // Mappings
    mapping(bytes32 => FidelityProof) public proofs;
    mapping(address => bool) public authorizedVerifiers;
    mapping(bytes32 => uint256) public proofSubmissionTime;
    
    // Events
    event ProofSubmitted(
        bytes32 indexed proofId,
        address indexed verifier,
        uint256 fidelityScore,
        uint256 timestamp
    );
    
    event ProofVerified(
        bytes32 indexed proofId,
        bool success,
        uint256 timestamp
    );
    
    event VerifierAuthorized(address indexed verifier, bool authorized);
    
    event FidelityThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    
    event ChainlinkFeedUpdated(address indexed oldFeed, address indexed newFeed);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender], "Not an authorized verifier");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    /**
     * @notice Constructor initializes the oracle contract
     * @param _chainlinkPriceFeed Address of Chainlink price feed for real-time metrics
     */
    constructor(address _chainlinkPriceFeed) {
        owner = msg.sender;
        chainlinkPriceFeed = AggregatorV3Interface(_chainlinkPriceFeed);
        authorizedVerifiers[msg.sender] = true;
        paused = false;
    }
    
    /**
     * @notice Submit a 50-qubit fidelity proof for verification
     * @param _tensorHash Hash of the quantum tensor state
     * @param _fidelityScore Fidelity score in basis points (10000 = 100%)
     * @param _signature Cryptographic signature of the proof
     * @return proofId Unique identifier for the submitted proof
     */
    function submitFidelityProof(
        bytes32 _tensorHash,
        uint256 _fidelityScore,
        bytes memory _signature
    ) external onlyAuthorizedVerifier whenNotPaused returns (bytes32 proofId) {
        require(_fidelityScore <= 10000, "Invalid fidelity score");
        require(_tensorHash != bytes32(0), "Invalid tensor hash");
        require(_signature.length > 0, "Signature required");
        
        // Generate unique proof ID
        proofId = keccak256(
            abi.encodePacked(
                _tensorHash,
                msg.sender,
                block.timestamp,
                block.number
            )
        );
        
        require(proofs[proofId].timestamp == 0, "Proof already exists");
        
        // Create proof record
        proofs[proofId] = FidelityProof({
            timestamp: block.timestamp,
            fidelityScore: _fidelityScore,
            tensorHash: _tensorHash,
            verifier: msg.sender,
            verified: false,
            qubitCount: QUBIT_COUNT,
            signature: _signature
        });
        
        proofSubmissionTime[proofId] = block.timestamp;
        
        emit ProofSubmitted(proofId, msg.sender, _fidelityScore, block.timestamp);
        
        return proofId;
    }
    
    /**
     * @notice Verify a submitted fidelity proof
     * @param _proofId Unique identifier of the proof to verify
     * @return success True if verification passed
     */
    function verifyFidelityProof(bytes32 _proofId) 
        external 
        onlyAuthorizedVerifier 
        whenNotPaused 
        returns (bool success) 
    {
        FidelityProof storage proof = proofs[_proofId];
        
        require(proof.timestamp > 0, "Proof does not exist");
        require(!proof.verified, "Proof already verified");
        require(
            block.timestamp <= proof.timestamp + PROOF_VALIDITY_PERIOD,
            "Proof expired"
        );
        
        // Verify fidelity threshold
        require(
            proof.fidelityScore >= MIN_FIDELITY_THRESHOLD,
            "Fidelity below threshold"
        );
        
        // Verify qubit count
        require(proof.qubitCount == QUBIT_COUNT, "Invalid qubit count");
        
        // Mark as verified
        proof.verified = true;
        
        emit ProofVerified(_proofId, true, block.timestamp);
        
        return true;
    }
    
    /**
     * @notice Get real-time metrics from Chainlink price feed
     * @return roundId The round ID
     * @return price The latest price
     * @return startedAt Timestamp when round started
     * @return updatedAt Timestamp when round was updated
     * @return answeredInRound The round ID in which the answer was computed
     */
    function getChainlinkMetrics() 
        external 
        view 
        returns (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) 
    {
        (
            roundId,
            price,
            startedAt,
            updatedAt,
            answeredInRound
        ) = chainlinkPriceFeed.latestRoundData();
        
        return (roundId, price, startedAt, updatedAt, answeredInRound);
    }
    
    /**
     * @notice Get proof details
     * @param _proofId Unique identifier of the proof
     * @return proof The FidelityProof struct
     */
    function getProof(bytes32 _proofId) 
        external 
        view 
        returns (FidelityProof memory) 
    {
        return proofs[_proofId];
    }
    
    /**
     * @notice Check if a proof is valid and verified
     * @param _proofId Unique identifier of the proof
     * @return isValid True if proof is valid and verified
     */
    function isProofValid(bytes32 _proofId) external view returns (bool) {
        FidelityProof memory proof = proofs[_proofId];
        
        if (proof.timestamp == 0) return false;
        if (!proof.verified) return false;
        if (block.timestamp > proof.timestamp + PROOF_VALIDITY_PERIOD) return false;
        if (proof.fidelityScore < MIN_FIDELITY_THRESHOLD) return false;
        
        return true;
    }
    
    /**
     * @notice Authorize or revoke a verifier
     * @param _verifier Address of the verifier
     * @param _authorized True to authorize, false to revoke
     */
    function setVerifierAuthorization(address _verifier, bool _authorized) 
        external 
        onlyOwner 
    {
        require(_verifier != address(0), "Invalid verifier address");
        authorizedVerifiers[_verifier] = _authorized;
        emit VerifierAuthorized(_verifier, _authorized);
    }
    
    /**
     * @notice Update Chainlink price feed address
     * @param _newFeed New Chainlink price feed address
     */
    function updateChainlinkFeed(address _newFeed) external onlyOwner {
        require(_newFeed != address(0), "Invalid feed address");
        address oldFeed = address(chainlinkPriceFeed);
        chainlinkPriceFeed = AggregatorV3Interface(_newFeed);
        emit ChainlinkFeedUpdated(oldFeed, _newFeed);
    }
    
    /**
     * @notice Pause or unpause the contract
     * @param _paused True to pause, false to unpause
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }
    
    /**
     * @notice Transfer ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }
}
