// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenFaucet is Ownable, ReentrancyGuard {
    ERC20 public immutable token;
    uint256 public constant CLAIM_AMOUNT = 100 * 10**18; // 100 tokens
    uint256 public constant COOLDOWN_PERIOD = 24 hours;
    
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public claimCount;
    
    event TokensClaimed(address indexed user, uint256 amount);
    
    constructor(address _token) Ownable(msg.sender) {
        token = ERC20(_token);
    }
    
    function claimTokens() external nonReentrant {
        require(canClaim(msg.sender), "Cannot claim tokens yet");
        
        lastClaimTime[msg.sender] = block.timestamp;
        claimCount[msg.sender]++;
        
        require(token.transfer(msg.sender, CLAIM_AMOUNT), "Transfer failed");
        
        emit TokensClaimed(msg.sender, CLAIM_AMOUNT);
    }
    
    function canClaim(address user) public view returns (bool) {
        return block.timestamp >= lastClaimTime[user] + COOLDOWN_PERIOD;
    }
    
    function getTimeUntilNextClaim(address user) external view returns (uint256) {
        if (canClaim(user)) return 0;
        return lastClaimTime[user] + COOLDOWN_PERIOD - block.timestamp;
    }
    
    // Owner functions
    function depositTokens(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
    
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.transfer(owner(), amount), "Transfer failed");
    }
}
