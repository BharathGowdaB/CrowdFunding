//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from '../../contracts/project/project.sol';

contract ProjectMock is Project {

    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity, uint _amountRaised)
    Project(_starterId, _title, _description , _amountRequired, _fundingDuration, _isCharity) { 
        amountRaised = _amountRaised;
    }
}