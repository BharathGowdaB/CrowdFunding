pragma solidity >=0.7.0 <0.9.0;

import { Starter } from './starter.sol';
import { Backer } from './backer.sol';
import { Database } from './db.sol';
import { AttestData, VerificationState, VerificationData } from './utils/definations.sol';
import { minUpdateGap } from './utils/constant.sol';
import { dbAddress } from './utils/db.address.sol';

import 'hardhat/console.sol';

contract Crowdfunding{
    event VerifyUser(address);

    Database private db;
    address private admin;

    mapping(string => Backer) private backerList;
    mapping(string => Starter) private starterList;
    mapping(Starter => VerificationData) private verifiedList;

    constructor(){
        admin = msg.sender;
        db = Database(dbAddress);
    }

    function _getDB() public view returns(address){
        return address(db);
    }
    
    function createStarter(string memory name,string memory _email, string memory _password) public 
        {
            require(starterList[_email] == Starter(address(0)), "Email Already Registered");
            starterList[_email] = new Starter(msg.sender, name, _email, _password);
            db.addStarter(address(starterList[_email]));
        }

    function authenticateStarter(string memory _email, string memory _password) public view 
        returns (address) {
            require(starterList[_email] != Starter(address(0)), "Email Not Registered");
            return starterList[_email].authenticate(msg.sender, _email, _password);
        }
    
    function createBacker(string memory name,string memory _email, string memory _password) public 
        {
            require(backerList[_email] == Backer(address(0)), "Email Already Registered");
            backerList[_email] = new Backer(msg.sender, name, _email, _password);
        }

    function authenticateBacker(string memory _email, string memory _password) public view 
        returns (address) {
            require(backerList[_email] != Backer(address(0)), "Email Not Registered");
            return backerList[_email].authenticate(msg.sender, _email, _password);
        }

    function documentVerification(string memory _email, string memory _password, AttestData memory _kycData) public 
        {
            require(starterList[_email] != Starter(address(0)), "Email Not Registered");
            require((block.timestamp - verifiedList[starterList[_email]].lastUpdate) > minUpdateGap, "Please Try again after sometime: Verification Process has cooldone time of 4 hours. ");
            require(verifiedList[starterList[_email]].state != VerificationState.verified, "User already Verified");

            verifiedList[starterList[_email]] = VerificationData(block.timestamp , _kycData, VerificationState.inProgress);
            emit VerifyUser(starterList[_email].authenticate(msg.sender, _email, _password));
        }

    function verifyStarter(Starter _starter, VerificationState _state) public 
        {
            require(admin == msg.sender, "UnAuthorized");
            verifiedList[_starter].lastUpdate = block.timestamp;
            verifiedList[_starter].state = _state;
        }

    function checkStarterVerified(Starter _starter) public view 
        returns(VerificationState, string memory){
            string memory value;
            VerificationState state = verifiedList[_starter].state;
            
            if(state == VerificationState.verified){
                value = "verified";
            } else if(state == VerificationState.inProgress){
                value = "inProgress";
            } else if(state == VerificationState.failed){
                value = "failed";
            } else{
                value = "initial";
            }

            return (state, value);
        }
    
}
