//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Database } from './db.sol';
import { Crowdfunding } from './crowdfunding.sol';
import { Validator } from './validator.sol';

import { Charity } from '../project/charity.sol';
import { Startup } from '../project/startup.sol';
import { Milestone } from '../project/milestone.sol';
import { Backer } from '../user/backer.sol';

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

contract MilestoneLamda{
    address internal admin;

    function init() 
        public {
            require(admin == address(0), "602");
        
            admin = msg.sender;
        }


    function createMilestone(string memory _title, string memory _description, uint _fundsRequired, uint _amountRaised, uint _returnAmount) 
        public returns(address) {
            require(Validator(validatorAddress).isTitle(_title), '422');
            require(Crowdfunding(admin).checkStarterVerified(Startup(msg.sender).starterId()) == VerificationState.verified, "410");

            address newMilestoneAddress = address(new Milestone(msg.sender, _title, _description, _fundsRequired, _amountRaised, _returnAmount));
            return newMilestoneAddress;
        }
}

contract BackerLamda{
    address internal admin;

    function init() 
        public {
            require(admin == address(0), "602");
        
            admin = msg.sender;
        }
    
    function createBacker(address _address, string memory name, string memory _email, string memory _password) 
        public returns(address) {
            require(msg.sender == admin, '401');

            require(Validator(validatorAddress).isEmail(_email), '420');
            require(Validator(validatorAddress).isPassword(_password), '421');
            require(Validator(validatorAddress).isTitle(name), '422');

            address newBacker = address(new Backer(_address, name, _email, _password));
            return newBacker;
        } 

}