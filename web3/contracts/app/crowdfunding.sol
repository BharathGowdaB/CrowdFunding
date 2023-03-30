//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Starter } from '../user/starter.sol';
import { Backer } from '../user/backer.sol';
import { Database } from './db.sol';
import { AttestData, VerificationState, VerificationData } from '../utils/definitions.sol';
import { minUpdateGap } from '../utils/constants.sol';
import { dbAddress } from '../utils/db.address.sol';

contract Crowdfunding{
    event VerifyUser(address);

    Database public db;
    address private admin;

    mapping(string => Backer) private backerList;
    mapping(string => Starter) private starterList;
    mapping(Starter => VerificationData) private verifiedList;

    constructor()
        {
            admin = msg.sender;
            db = Database(dbAddress);
            db.updateAdmin();
        }
    
    function createStarter(string memory name,string memory _email, string memory _password) public returns(Starter)
        {
            require(starterList[_email] == Starter(address(0)), "402");
            starterList[_email] = new Starter(msg.sender, name, _email, _password);
            
            db.addStarter(address(starterList[_email]));
            return starterList[_email] ;
        }

    function authenticateStarter(string memory _email, string memory _password) public view 
        returns (address) 
        {
            require(starterList[_email] != Starter(address(0)), "405");
            return starterList[_email].authenticate(msg.sender, _email, _password);
        }
    
    function createBacker(string memory name,string memory _email, string memory _password) public 
        {
            require(backerList[_email] == Backer(address(0)), "402");
            backerList[_email] = new Backer(msg.sender, name, _email, _password);
        }

    function authenticateBacker(string memory _email, string memory _password) public view 
        returns (address) 
        {
            require(backerList[_email] != Backer(address(0)), "405");
            return backerList[_email].authenticate(msg.sender, _email, _password);
        }

    
    function documentVerification(string memory _email, string memory _password, AttestData memory _kycData) public 
        {
            require(starterList[_email] != Starter(address(0)), "405");
            require((block.timestamp - verifiedList[starterList[_email]].lastUpdate) > minUpdateGap, "501");
            require(verifiedList[starterList[_email]].state != VerificationState.verified, "204");

            verifiedList[starterList[_email]] = VerificationData(block.timestamp , _kycData, VerificationState.inProgress);
            emit VerifyUser(starterList[_email].authenticate(msg.sender, _email, _password));
        }

    function verifyStarter(Starter _starter, VerificationState _state) public 
        {
            require(admin == msg.sender, "401");
            verifiedList[_starter].lastUpdate = block.timestamp;
            verifiedList[_starter].state = _state;
        }

    function checkStarterVerified(address _starter) public view 
        returns(VerificationState)
        {
            return verifiedList[Starter(_starter)].state;
        }
    
}
