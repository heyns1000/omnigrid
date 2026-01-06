// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

/**
 * @title QuantumOracle
 * @dev Multi-chain quantum oracle with 9-second pulse feeds
 * @notice Supports Ethereum Sepolia and Polygon Mumbai with Chainlink Automation
 */
contract QuantumOracle is AutomationCompatibleInterface {
    // State variables
    address public owner;
    uint256 public lastUpdateTimestamp;
    uint256 public constant PULSE_INTERVAL = 9 seconds;
    uint256 public pulseCount;
    
    // Oracle data structure
    struct OracleData {
        uint256 timestamp;
        bytes32 dataHash;
        uint256 fidelityScore; // Out of 94 repositories
        bool isValid;
    }
    
    // Mapping of pulse ID to oracle data
    mapping(uint256 => OracleData) public pulseData;
    
    // Events
    event PulseUpdated(uint256 indexed pulseId, uint256 timestamp, bytes32 dataHash, uint256 fidelityScore);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        lastUpdateTimestamp = block.timestamp;
        pulseCount = 0;
    }
    
    /**
     * @dev Chainlink Automation checkUpkeep function
     * @return upkeepNeeded Whether upkeep is needed
     * @return performData Data to pass to performUpkeep
     */
    function checkUpkeep(bytes calldata /* checkData */)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastUpdateTimestamp) >= PULSE_INTERVAL;
        performData = "";
    }
    
    /**
     * @dev Chainlink Automation performUpkeep function
     * @param performData Data from checkUpkeep
     */
    function performUpkeep(bytes calldata performData) external override {
        require((block.timestamp - lastUpdateTimestamp) >= PULSE_INTERVAL, "Pulse interval not reached");
        
        // Update pulse data
        pulseCount++;
        lastUpdateTimestamp = block.timestamp;
        
        // Generate data hash from timestamp and pulse count
        bytes32 dataHash = keccak256(abi.encodePacked(block.timestamp, pulseCount, block.number));
        
        // Calculate fidelity score (simulated - would be from actual data feeds)
        uint256 fidelityScore = 94; // All 94 repositories in sync
        
        pulseData[pulseCount] = OracleData({
            timestamp: block.timestamp,
            dataHash: dataHash,
            fidelityScore: fidelityScore,
            isValid: true
        });
        
        emit PulseUpdated(pulseCount, block.timestamp, dataHash, fidelityScore);
    }
    
    /**
     * @dev Manual pulse update (owner only, for emergency use)
     * @param _dataHash Data hash to store
     * @param _fidelityScore Fidelity score out of 94
     */
    function manualPulseUpdate(bytes32 _dataHash, uint256 _fidelityScore) external onlyOwner {
        require(_fidelityScore <= 94, "Fidelity score must be <= 94");
        
        pulseCount++;
        lastUpdateTimestamp = block.timestamp;
        
        pulseData[pulseCount] = OracleData({
            timestamp: block.timestamp,
            dataHash: _dataHash,
            fidelityScore: _fidelityScore,
            isValid: true
        });
        
        emit PulseUpdated(pulseCount, block.timestamp, _dataHash, _fidelityScore);
    }
    
    /**
     * @dev Get the latest pulse data
     * @return Latest OracleData struct
     */
    function getLatestPulse() external view returns (OracleData memory) {
        require(pulseCount > 0, "No pulse data available");
        return pulseData[pulseCount];
    }
    
    /**
     * @dev Get pulse data by ID
     * @param _pulseId Pulse ID to retrieve
     * @return OracleData struct for the given pulse ID
     */
    function getPulseById(uint256 _pulseId) external view returns (OracleData memory) {
        require(_pulseId > 0 && _pulseId <= pulseCount, "Invalid pulse ID");
        return pulseData[_pulseId];
    }
    
    /**
     * @dev Transfer ownership
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    /**
     * @dev Get time until next pulse
     * @return Seconds until next pulse is due
     */
    function getTimeUntilNextPulse() external view returns (uint256) {
        uint256 timeSinceLastUpdate = block.timestamp - lastUpdateTimestamp;
        if (timeSinceLastUpdate >= PULSE_INTERVAL) {
            return 0;
        }
        return PULSE_INTERVAL - timeSinceLastUpdate;
    }
}
