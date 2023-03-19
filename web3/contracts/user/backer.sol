//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';

contract Backer is User{

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}
    
    
    function fundProject(address _projectAddress) public 
        {
            require(id == msg.sender, "UnAuthorized");

            // your logic
        }

}
