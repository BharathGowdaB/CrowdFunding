pragma solidity >=0.7.0 <0.9.0;
import { Starter } from './starter.sol';
import { Database } from './db.sol';
import { AttestData, VerificationState, VerificationData } from './utils/definations.sol';
import { minUpdateGap , maxGetProjectList } from './utils/constant.sol';
import { dbAddress } from './utils/db.address.sol';

import 'hardhat/console.sol';

contract Crowdfunding{
    event VerifyUser(address);
    Database public db;

    address private admin;
    mapping(string => Starter) private starterList;
    mapping(Starter => VerificationData) private verifiedList;

    constructor(){
        admin = msg.sender;
        db = Database(dbAddress);
    }

    function newStarter(string memory name,string memory _email, string memory _password) public 
        {
            require(starterList[_email] == Starter(address(0)), 'Email Already Registered');
            starterList[_email] = new Starter(msg.sender, name, _email, _password);
            db.addStarter(address(starterList[_email]));
        }

    function authenticateStarter(string memory _email, string memory _password) public view 
        returns (address) {
            require(starterList[_email] != Starter(address(0)), 'Email Not Registered');
            return starterList[_email].authenticate(msg.sender, _email, _password);
        }

    function kycVerification(string memory _email, string memory _password, AttestData memory _kycData) public 
        {
            require(starterList[_email] != Starter(address(0)), 'Email Not Registered');
            require((block.timestamp - verifiedList[starterList[_email]].lastUpdate) > minUpdateGap, 'Please Try again after sometime');
            require(verifiedList[starterList[_email]].state != VerificationState.verified, 'User already Verified');

            verifiedList[starterList[_email]] = VerificationData(block.timestamp , _kycData, VerificationState.inProgress);
            emit VerifyUser(starterList[_email].authenticate(msg.sender, _email, _password));
        }

    function verifyStarter(Starter _starter, VerificationState _state) public 
        {
            require(admin == msg.sender, 'UnAuthorized');
            verifiedList[_starter].lastUpdate = block.timestamp;
            verifiedList[_starter].state = _state;
        }

    function isStarterVerified(Starter _starter) public view 
        returns(VerificationState){
            return verifiedList[_starter].state;
        }
    
}
