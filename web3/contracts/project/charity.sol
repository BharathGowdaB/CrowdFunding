//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';
import { User } from '../user/user.sol';
import { ProjectState } from '../utils/definitions.sol';

contract Charity is Project {
    constructor(address _creator, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    Project(_creator, _title, _description , _amountRequired, _fundingDuration, true) { }

    function addBacker() public payable {
        require(state == ProjectState.inFunding, "This project is no longer accepting backers.");
        require(block.timestamp < endTime, "The deadline for supporting this project has passed.");
        require(msg.value > 0, "Amount must be greater than zero.");
        bool isAlreadyBacker = false;
        for (uint i = 0; i < contributors.length; i++) {
            if (contributors[i] == msg.sender) {
                isAlreadyBacker = true;
                backers[msg.sender] += msg.value;
                break;
            }
        }

        if (!isAlreadyBacker) {
            contributors.push(msg.sender);
            backers[msg.sender] = msg.value;
        }
    }
    

    function releaseFunds() public payable{
        require(state == ProjectState.inFunding, "Funds have already been released or locked.");
        require(msg.sender == creator, "Only owner can release funds");
        require(block.timestamp >= endTime, "Funds cannot be released before the time limit.");

        payable(User(msg.sender).id()).transfer(amountRaised);
        changeState(ProjectState.ended);
    }

    function abortProject() public {
        require(msg.sender == creator, "Only the creator can abort the project.");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "The project cannot be aborted outside of the time limit.");
        require(state == ProjectState.inFunding, "The project has already been aborted or completed.");
        for(uint i=0; i<contributors.length;i++){
            address payable backer = payable(contributors[i]);
            uint256 amount = backers[backer];
            payable(backer).transfer(amount);
            backers[backer] = 0;
        }
        
        changeState(ProjectState.aborted);
    }
    function getRefund() public {
        require(backers[msg.sender] > 0, "You have not contribute to project");
        uint256 amount = backers[msg.sender];
        payable(msg.sender).transfer(amount);
        backers[msg.sender] = 0;
        
    }
    
}

    
