//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';

import { User } from '../user/user.sol';

import { ProjectState } from '../utils/definitions.sol';


contract Charity is Project {
    
    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
        Project(_starterId, _title, _description , _amountRequired, _fundingDuration, true) { }


    function releaseFunds() 
        public {
            require(id == msg.sender, "444");
            require(state == ProjectState.inFunding, "441");
            require(block.timestamp >= endTime, "440");

            payable(id).transfer(address(this).balance);
            state = ProjectState.ended;
        }

    function abortProject() 
        public {
            require(id == msg.sender, "401");
            require(state == ProjectState.inFunding, "445");

            for(uint i = 0 ; i < backersList.length ; i++){
                if(backers[backersList[i]] == 0) continue;
                (bool sent,) = payable(User(backersList[i]).id()).call{value : backers[backersList[i]]}("");
                require(sent == true, '500');
                backers[backersList[i]] = 0;
            }

            state = ProjectState.aborted;
        }
}