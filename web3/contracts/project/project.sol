//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { ProjectState } from '../utils/definitions.sol';

contract Project {
    address internal creator;
    string internal title;
    string internal description;
    uint public amountRequired;
    uint public amountRaised;
    uint internal startTime;
    uint internal endTime;
    bool public isCharity = false;

    ProjectState internal state;

    address[] internal milestones;
    mapping(address => uint) internal backers;

    constructor(address _creator, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity){
        startTime= block.timestamp;
        require(_fundingDuration > 1 hours, 'Cannot End Project Before Starting');
        creator = _creator;
        title = _title;
        description = _description;
        amountRaised = 0;
        amountRequired = _amountRequired;
        endTime = startTime + _fundingDuration;
        changeState(ProjectState.inFunding);
        isCharity = _isCharity;
    }

    function getProjectDetails() public view 
        returns(address, string memory, string memory, uint, uint, ProjectState, bool){
            return (creator, title, description, amountRequired, amountRaised, state, isCharity);
        }
    
    function changeState(ProjectState _state) internal {
        state = _state;
    }


}

