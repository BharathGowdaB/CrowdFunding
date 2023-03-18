pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';
import { Charity } from './charityProject.sol';
import { Startup } from './startupProject.sol';
import { dbAddress } from './utils/db.address.sol';
import { Database } from './db.sol';

contract Starter is User{

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}
    
    
    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _endTime, bool _isCharity) public 
        {
            require(id == msg.sender, "UnAuthorized");

            if(_isCharity)
                projectList.push(new Charity(_title,_description, _amountRequired, _endTime));
            else
                projectList.push(new Startup(_title,_description, _amountRequired, _endTime));
                
            Database(dbAddress).addProject(address(projectList[projectList.length - 1]));
        }
}
