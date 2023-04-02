//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from '../user/user.sol';

import { ProjectState } from '../utils/definitions.sol';
import { minFundingPeriod } from '../utils/constants.sol';

contract Project {
    address public id;
    address public starterId;
    uint public amountRaised;
    bool public isCharity = false;

    
    string internal title;
    string internal description;
    uint internal amountRequired;
    uint internal startTime;
    uint internal endTime;
    ProjectState internal state;

    address[] internal milestones;
    mapping(address => uint) public backers;
    address[] public backersList;

    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity){
        require(_fundingDuration > minFundingPeriod, '431');
        
        startTime= block.timestamp;
        starterId = _starterId;
        id = User(_starterId).id();
        title = _title;
        description = _description;
        amountRaised = 0;
        amountRequired = _amountRequired;
        endTime = startTime + _fundingDuration;
        state = ProjectState.inFunding;
        isCharity = _isCharity;
    }
    
    function getProjectDetails() 
        public view  returns(address, string memory, string memory, uint, uint, ProjectState, bool, uint) {
            return (starterId, title, description, amountRequired, amountRaised, state, isCharity, backersList.length);
        }

    function refundFunds() 
        public {
            require(state == ProjectState.inFunding, "441");
            require(block.timestamp < endTime, "443");
            require(backers[msg.sender] > 0, '415');

            (bool sent,) = payable(User(msg.sender).id()).call{value: backers[msg.sender]}("");
            require(sent== true, '500');

            amountRaised -= backers[msg.sender];
            backers[msg.sender] = 0;
        }

    function addBacker() 
        public virtual payable { 
            require(state == ProjectState.inFunding, "442");
            require(block.timestamp < endTime, "443");
            require(msg.value > 0, "432");
            
            amountRaised += msg.value;
            backers[msg.sender] += msg.value;

            for(uint i = 0 ; i < backersList.length ; i++){
                if(backersList[i] == msg.sender) return;
            }

            backersList.push(msg.sender);
        }

}

