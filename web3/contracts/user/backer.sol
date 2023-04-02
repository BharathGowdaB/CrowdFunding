//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';

import { Database } from '../app/db.sol';
import { Project } from '../project/project.sol';
import { Startup } from '../project/startup.sol';
import { Milestone } from '../project/milestone.sol';

import { dbAddress } from '../utils/address.sol';


contract Backer is User{
    modifier onlyCreator {
        require(id == msg.sender, "401");
        _;
    }

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}
    
    function fundProject(address _projectAddress) 
        public payable {
            require(id == msg.sender, "401");            
            Project(_projectAddress).addBacker{value: msg.value}();

            for(uint i = 0 ; i < projectList.length ; i++){
                if(projectList[i] == _projectAddress){
                    return;
                }
            }

            projectList.push(_projectAddress);
        }
    
    function returnProjectFunds(address _projectAddress) 
        public {
            Project(_projectAddress).refundFunds();
        }
    function logMessage(address _projectAddress, string memory _body)
        public onlyCreator {
            Database(dbAddress).addLogMessage(_projectAddress, _body);
        } 

    function voteMilestone(address _milestoneAddress, bool _vote) 
        public onlyCreator {

            Milestone(_milestoneAddress).updateVote(_vote);
        }
    
    function endProject(address _projectAddress, bool _vote)
        public onlyCreator {
            Startup(_projectAddress).voteEndProject(_vote);
        }
}

