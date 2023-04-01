//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Database } from './db.sol';
import { Crowdfunding } from './crowdfunding.sol';
import { Validator } from './validator.sol';

import { Charity } from '../project/charity.sol';
import { Startup } from '../project/startup.sol';

import { VerificationState } from '../utils/definitions.sol';
import { validatorAddress } from '../utils/address.sol';

contract CharityLamda{

    address internal admin;
    address internal dbAddress;

    function init(address _dbAddress) 
        public {
            require(admin == address(0), "602");
            require(dbAddress == address(0), "602");
            
            admin = msg.sender;
            dbAddress = _dbAddress;
        }

    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration) 
        public returns(address) {
            require(Validator(validatorAddress).isTitle(_title), '422');
            require(dbAddress != address(0), '601');
            require(Crowdfunding(admin).checkStarterVerified(msg.sender) == VerificationState.verified, "410");
        
            address newProjectAddress = address(new Charity(msg.sender, _title,_description, _amountRequired, _fundingDuration));
            Database(dbAddress).addProject(newProjectAddress);
        
            return newProjectAddress;
        }
}

contract StartupLamda{

    address internal admin;
    address internal dbAddress;

    function init(address _dbAddress) 
        public {
            require(admin == address(0), "602");
            require(dbAddress == address(0), "602");
        
            admin = msg.sender;
            dbAddress = _dbAddress;
        }


    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration) 
        public returns(address) {
            require(Validator(validatorAddress).isTitle(_title), '422');
            require(dbAddress != address(0), '601');
            require(Crowdfunding(admin).checkStarterVerified(msg.sender) == VerificationState.verified, "410");

            address newProjectAddress = address(new Startup(msg.sender, _title,_description, _amountRequired, _fundingDuration));
            Database(dbAddress).addProject(newProjectAddress);
        
            return newProjectAddress;
        }
}