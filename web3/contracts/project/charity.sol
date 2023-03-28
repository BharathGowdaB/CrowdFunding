//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';

contract Charity is Project {
    constructor(address _creator, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    Project(_creator, _title, _description , _amountRequired, _fundingDuration, true) { }

    function releaseFunds() public {
        require(state == ProjectState.inFunding, "Funds have already been released or locked.");
        require(msg.sender == project.creator, "Only owner can release funds");
        require(block.timestamp >= endTime, "Funds cannot be released before the time limit.");
        state = ProjectState.inExecution;
    }

    function abortProject() public {
        require(msg.sender == creator, "Only the creator can abort the project.");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "The project cannot be aborted outside of the time limit.");
        require(state == ProjectState.inFunding, "The project has already been aborted or completed.");
        state = ProjectState.aborted;
    }
}