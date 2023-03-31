//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { DatabaseSorter } from '../../contracts/app/db.sol';

contract DatabaseMock is DatabaseSorter {

    function addProjectMock(address _projectAddress) public {
        projectList.push(_projectAddress);
    }
}