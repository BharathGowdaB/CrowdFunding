//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';

contract Charity is Project {
    constructor(address _creator, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    Project(_creator, _title, _description , _amountRequired, _fundingDuration, true) { }

    function releaseFunds() public {
        // your logic
    }

    function abortProject() public {
        // your logic
    }
}