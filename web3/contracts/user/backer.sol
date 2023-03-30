//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';
import { Project } from '../project/project.sol';

contract Backer is User{

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}
    
    
    function fundProject(address _projectAddress) public payable
        {
            require(id == msg.sender, "401");            
            Project(_projectAddress).addBacker{value: msg.value}();

            for(uint i = 0 ; i < projectList.length ; i++){
                if(projectList[i] == _projectAddress){
                    return;
                }
            }

            projectList.push(_projectAddress);
        }

}
