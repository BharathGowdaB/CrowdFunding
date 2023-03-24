//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { DatabaseSorter } from '../../contracts/app/db.sol';
import { Project } from '../../contracts/project/project.sol';

contract ProjectMock is Project {
    constructor(address _creator, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity, uint _amountRaised)
    Project(_creator, _title, _description , _amountRequired, _fundingDuration, _isCharity) { 
        amountRaised = _amountRaised;
    }
}

contract DatabaseMock is DatabaseSorter {
    function addProjectMock(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity, uint _amountRasied) public {
        projectList.push(address(new ProjectMock(msg.sender, _title,_description, _amountRequired, _fundingDuration,  _isCharity, _amountRasied)));

  }
}