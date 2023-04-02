//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from '../../contracts/project/project.sol';
import { Charity } from '../../contracts/project/charity.sol';
import { Startup } from '../../contracts/project/startup.sol';

import { ProjectState } from '../../contracts/utils/definitions.sol';
 
contract ProjectMock is Project {

    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity, uint _amountRaised)
    Project(_starterId, _title, _description , _amountRequired, _fundingDuration, _isCharity) { 
        amountRaised = _amountRaised;
    }

}

contract CharityMock is Charity {
    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration,uint _amountRaised)
    Charity(_starterId, _title, _description , _amountRequired, _fundingDuration) { 
        amountRaised = _amountRaised;
    }

    function setProjectState(ProjectState _state, uint _endTime)
        public {
            state = _state;
            endTime = _endTime;
        }

}

contract StartupMock is Startup {
    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration,uint _amountRaised)
    Startup(_starterId, _title, _description , _amountRequired, _fundingDuration) { 
        amountRaised = _amountRaised;
    }

    function setProjectState(ProjectState _state, uint _endTime)
        public payable{
            state = _state;
            endTime = _endTime;
        }

}