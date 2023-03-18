pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';

contract Charity is Project {
    event ProjectAborted();
    constructor(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    Project(_title, _description , _amountRequired, _fundingDuration, true) { }

    function releaseFunds() public {
        // your logic
        require(msg.sender == creator, "Only owner can release funds");
        require(amountRaised >= amountRequired, "Amount Required not reached");
        payable(msg.sender).transfer(address(this).balance);
    }

    function abortProject() public {
        require(msg.sender == creator, "Only creator can abort project");
        require(amountRaised < amountRequired, "Cannot abort project after funding goal reached");
        payable(creator).transfer(address(this).balance);
        // selfdestruct(payable(creator));
        emit ProjectAborted();
    } 
        
}