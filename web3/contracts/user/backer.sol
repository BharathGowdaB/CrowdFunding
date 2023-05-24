//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';

import { Database } from '../app/db.sol';
import { Project } from '../project/project.sol';
import { Startup } from '../project/startup.sol';
import { Milestone } from '../project/milestone.sol';

import { dbAddress } from '../utils/address.sol';

import { BackerOption } from "../utils/definitions.sol";

contract Backer is User{

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
    

    function logMessage(address _projectAddress, string memory _body)
        public {
            require(id == msg.sender, "401");          
            Database(dbAddress).addLogMessage(_projectAddress, _body);
        } 
    
    function updateProject(address _address, BackerOption option, bool _vote )
        public {
            require(id == msg.sender, "401");   
            if(option == BackerOption.start) Startup(_address).startProject();
            else if(option == BackerOption.refund) Project(_address).refundFunds();
            else if(option == BackerOption.milestone) Milestone(_address).updateVote(_vote);
            else Startup(_address).voteEndProject(_vote);
        }
}

