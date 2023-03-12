pragma solidity >=0.7.0 <0.9.0;
import {User} from './user.sol';

contract Starter is User{
    constructor(address _address, string memory _name, bytes memory _email, bytes memory _password)
    User(_address, _name, _email, _password){}

    function createProject(string memory _name) public {
     
    }
}
