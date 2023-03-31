//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from './user.sol';

import { charityLamdaAddress, startupLamdaAddress } from '../utils/address.sol';
import { CharityLamda, StartupLamda } from '../app/lamda.sol';

contract Starter is User{

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}
    
    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity) 
        public  {
            require(id == msg.sender, "401");
            if(_isCharity){
                projectList.push(CharityLamda(charityLamdaAddress).createProject(_title, _description, _amountRequired, _fundingDuration));
            }
            else{
                projectList.push(StartupLamda(startupLamdaAddress).createProject(_title, _description, _amountRequired, _fundingDuration));
            }
            
        }
    
}
