pragma solidity >=0.7.0 <0.9.0;
import { Starter } from './starter.sol';
import { AttestData, VerificationState, VerificationData } from './utils/definations.sol';
import { minUpdateGap , maxGetProjectList } from './utils/constant.sol';
import 'hardhat/console.sol';

contract crowdfunding{
    event VerifyUser(address);

    address private admin;
    mapping(string => Starter) private starterList;
    mapping(Starter => VerificationData) private verifiedList;

    // address[] private projectList;

    constructor(){
        admin = msg.sender;
    }

    function newStarter(string memory name,string memory _email, string memory _password) public {
        require(starterList[_email] == Starter(address(0)), 'Email Already Registered');
        starterList[_email] = new Starter(msg.sender, name, bytes(_email), bytes(_password));
    }

    function authenticateStarter(string memory _email, string memory _password) public view returns (address){
        require(starterList[_email] != Starter(address(0)), 'Email Not Registered');
        return starterList[_email].authenticate(msg.sender, bytes(_email), bytes(_password));
    }

    // function getProjectList(uint skip) public view returns(address[] memory){
    //     assert(skip <= projectList.length);
    
    //     uint length = skip + maxGetProjectList <= projectList.length ? maxGetProjectList : projectList.length - skip;
    //     address[] memory list = new address[](length);

    //     for(uint i = 0 ; i < length ; i++ ){
    //         list[i] = projectList[i + skip];
    //     }
        
    //     return list;
    // }

    function kycVerification(string memory _email, string memory _password, AttestData memory _kycData) public {
        require(starterList[_email] != Starter(address(0)), 'Email Not Registered');
        require((block.timestamp - verifiedList[starterList[_email]].lastUpdate) > minUpdateGap, 'Please Try again later');
        require(verifiedList[starterList[_email]].state != VerificationState.verified, 'User already Verified');

        verifiedList[starterList[_email]] = VerificationData(block.timestamp , _kycData, VerificationState.inProgress);
        emit VerifyUser(starterList[_email].authenticate(msg.sender, bytes(_email), bytes(_password)));
    }

    function verifyStarter(Starter _starter, VerificationState _state) public {
        assert(admin == msg.sender);
        verifiedList[_starter].lastUpdate = block.timestamp;
        verifiedList[_starter].state = _state;
    }

    function isStarterVerified(Starter _starter) public view returns(VerificationState){
        return verifiedList[_starter].state;
    }
    
}