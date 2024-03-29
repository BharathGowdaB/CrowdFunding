//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from '../user/user.sol';

import { ProjectState , ProjectDetails} from '../utils/definitions.sol';
import { minFundingPeriod } from '../utils/constants.sol';

contract Project {
    event projectFunded(address, uint, uint);
    event fundsReleased(address, uint, uint);

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
        public view  returns(ProjectDetails memory) {
            return ProjectDetails( title, description, amountRequired , state, backersList.length, endTime);
        }


    function refundFunds() 
        public {
            require(state == ProjectState.inFunding, "441");
            require(block.timestamp < endTime, "443");
            require(backers[msg.sender] > 0, '415');

            (bool sent,) = payable(User(msg.sender).id()).call{value: backers[msg.sender]}("");
            require(sent== true, '500');

            amountRaised -= backers[msg.sender];
            emit fundsReleased(msg.sender, backers[msg.sender], block.timestamp );

            backers[msg.sender] = 0;
        }

    function addBacker() 
        public virtual payable { 
            require(state == ProjectState.inFunding, "442");
            require(block.timestamp < endTime, "443");
            require(msg.value > 0, "432");
            
            amountRaised += msg.value;
            backers[msg.sender] += msg.value;

            emit projectFunded(msg.sender, msg.value, block.timestamp);
            for(uint i = 0 ; i < backersList.length ; i++){
                if(backersList[i] == msg.sender) return;
            }

            backersList.push(msg.sender);
        }

}

