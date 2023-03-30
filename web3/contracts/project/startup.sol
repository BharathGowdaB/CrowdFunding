//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';
import { Milestone } from './milestone.sol';
import { ProjectState } from '../utils/definitions.sol';

contract Startup is Project {
    Milestone[] internal milestoneList;

    constructor(address _creator, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    Project(_creator, _title, _description , _amountRequired, _fundingDuration, false) { }

    function addBacker() public payable {
        require(state == ProjectState.inFunding, "This project is no longer accepting backers.");
        require(block.timestamp < endTime, "The deadline for supporting this project has passed.");
        require((amountRaised + msg.value) <= amountRequired, "Funding Amount Excedes the limit.");
        require(msg.value > 0, "Amount sent is zero");
        amountRaised += msg.value;
        backers[msg.sender] += msg.value;
    }

    function addMileStone() public {
        // your logic
    }

    function getMilestones(uint _skip) public view
        returns(address[] memory){
           // your logic
        }

    function voteMileStone(address _milestoneAddress, bool vote) public {
        // your logic
    }

    function releaseMilestoneFunds(address _mileStoneAddress) public {
        // your logic
    }

    function abortProject() public view{
        //your logic
    }
}
