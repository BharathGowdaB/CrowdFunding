//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Database } from './db.sol';
import { CharityLamda, StartupLamda } from './lamda.sol';
import { Validator } from './validator.sol';

import { Starter } from '../user/starter.sol';
import { Backer } from '../user/backer.sol';

import { AttestData, VerificationState, VerificationData } from '../utils/definitions.sol';
import { dbAddress, charityLamdaAddress, startupLamdaAddress, validatorAddress } from '../utils/address.sol';
import { minUpdateGap } from '../utils/constants.sol';


contract Crowdfunding{
    
    event VerifyUser(address);
    Database public db;
    address public admin;

    mapping(string => address) private backerList;
    mapping(string => address) private starterList;
    mapping(address => VerificationData) private verifiedList;

    constructor() {
        admin = msg.sender;
        db = Database(dbAddress);
        db.init(charityLamdaAddress, startupLamdaAddress);

        CharityLamda(charityLamdaAddress).init(dbAddress);
        StartupLamda(startupLamdaAddress).init(dbAddress);
    }
    
    function createStarter(string memory name, string memory _email, string memory _password) 
        public returns(address) {
            require(Validator(validatorAddress).isEmail(_email), '420');
            require(Validator(validatorAddress).isPassword(_password), '421');
            require(Validator(validatorAddress).isTitle(name), '422');
            
            require(starterList[_email] == address(0), "402");

            starterList[_email] = address(new Starter(msg.sender, name, _email, _password));
            db.addStarter(starterList[_email]);

            return starterList[_email];
        }   

    function authenticateStarter(string memory _email, string memory _password) 
        public view  returns(address) {
            require(starterList[_email] != address(0), "403");
            return Starter(starterList[_email]).authenticate(msg.sender, _email, _password);
        }
    
    function createBacker(string memory name, string memory _email, string memory _password) 
        public returns(address) {
            require(Validator(validatorAddress).isEmail(_email), '420');
            require(Validator(validatorAddress).isPassword(_password), '421');
            require(Validator(validatorAddress).isTitle(name), '422');

            require(backerList[_email] == address(0), "402");

            backerList[_email] = address(new Backer(msg.sender, name, _email, _password));

            return backerList[_email];
        }

    function authenticateBacker(string memory _email, string memory _password) 
        public view  returns(address) {
            require(backerList[_email] != address(0), "403");
            return Backer(backerList[_email]).authenticate(msg.sender, _email, _password);
        }

    
    function documentVerification(string memory _email, string memory _password, AttestData memory _kycData) 
        public {
            require(starterList[_email] != address(0), "403");
            require(starterList[_email] == Starter(starterList[_email]).authenticate(msg.sender, _email, _password), '401');
            require((block.timestamp - verifiedList[starterList[_email]].lastUpdate) > minUpdateGap, "430");
            require(verifiedList[starterList[_email]].state != VerificationState.verified, "411");

            verifiedList[starterList[_email]] = VerificationData(block.timestamp , _kycData, VerificationState.inProgress);
            emit VerifyUser(starterList[_email]);
        }
    
    function getVerificationData(address _starter) 
        public view returns(AttestData memory) {
            require(msg.sender == admin);
            return verifiedList[_starter].data;
        }

    function verifyStarter(address _starter, VerificationState _state) 
        public {
            require(admin == msg.sender, "401");
            verifiedList[_starter].state = _state;
        }

    function checkStarterVerified(address _starter) 
        public view  returns(VerificationState) {
            return verifiedList[_starter].state;
        }
    
}
