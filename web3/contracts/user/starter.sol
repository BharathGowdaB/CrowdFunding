//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';
import { dbAddress } from '../utils/db.address.sol';
import { Database } from '../app/db.sol';

contract Starter is User{

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}
    
    
    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity) public 
        {
            require(id == msg.sender, "401");
            projectList.push(Database(dbAddress).addProject(_title, _description, _amountRequired, _fundingDuration, _isCharity));

        }
}
