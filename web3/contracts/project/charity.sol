//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';

import { User } from '../user/user.sol';

import { ProjectState } from '../utils/definitions.sol';


contract Charity is Project {
    
    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
        Project(_starterId, _title, _description , _amountRequired, _fundingDuration, true) { }

    function addBacker() 
        public override payable {
            require(state == ProjectState.inFunding, "442");
            require(block.timestamp < endTime, "443");
            require(msg.value > 0, "432");
            
            amountRaised += msg.value;
            backers[msg.sender] += msg.value;

            for(uint i = 0 ; i < backersList.length ; i++){
                if(backersList[i] == msg.sender) return;
            }

            backersList.push(msg.sender);
        }

    function releaseFunds() 
        public {
            require(id == msg.sender, "444");
            require(state == ProjectState.inFunding, "441");
            require(block.timestamp >= endTime, "440");

            payable(id).transfer(amountRaised);
            state = ProjectState.ended;
        }

    function abortProject() 
        public {
            require(id == msg.sender, "401");
            require(state == ProjectState.inFunding, "445");

            for(uint i = 0 ; i < backersList.length ; i++){
                (bool sent,) = payable(User(backersList[i]).id()).call{value : backers[backersList[i]]}("");
                require(sent == true, '500');
                backers[backersList[i]] = 0;
            }

            state = ProjectState.aborted;
        }
}