// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Subsidy {
    address public government;
    mapping(address => uint256) public balances;
    mapping(address => bool) public approvedProducers;

    event SubsidyAllocated(address indexed producer, uint256 amount);
    event SubsidyClaimed(address indexed producer, uint256 amount);

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government can call this");
        _;
    }

    constructor() {
        government = msg.sender;
    }

    function approveProducer(address _producer) external onlyGovernment {
        approvedProducers[_producer] = true;
    }

    function allocateSubsidy(address _producer, uint256 _amount) external onlyGovernment {
        require(approvedProducers[_producer], "Producer not approved");
        balances[_producer] += _amount;
        emit SubsidyAllocated(_producer, _amount);
    }

    function claimSubsidy(uint256 _amount) external {
        require(approvedProducers[msg.sender], "Not an approved producer");
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit SubsidyClaimed(msg.sender, _amount);
    }

    // Government can deposit funds into the contract
    function fundContract() external payable onlyGovernment {}

    // Check contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
