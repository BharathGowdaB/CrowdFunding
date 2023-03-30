//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { ProjectState } from '../utils/definitions.sol';

contract Milestone {
    // state variables
    address private projectId;
    string private title;
    string private description;
    uint private fundsRequired;
    mapping(address => bool) voting;
    uint private startTime;
    ProjectState private state;
    uint private maxVotes;
    uint private cumulativeVotes;


    constructor(
        address _projectId,
        string memory _title,
        string memory _description,
        uint _fundsRequired,
        uint _maxVotes
    ) {
        projectId = _projectId;
        title = _title;
        description = _description;
        fundsRequired = _fundsRequired;
        maxVotes = _maxVotes;
        state = ProjectState.initial;
    }

    function changeState() public {
        require(
            state == ProjectState.inExecution ||
            state == ProjectState.inFunding,
            "Project is not in a valid state"
        );
        require(
            block.timestamp >= startTime + 1 weeks,
            "Voting period is not over yet"
        );
        state = ProjectState.ended;
    }

    function getVotingResult() public {
        
        uint yesVotes = 0;
        uint noVotes = 0;
        for (uint i = 0; i < cumulativeVotes; i++) {
            if (voting[address(uint160(i))]) {
                yesVotes++;
            } else {
                noVotes++;
            }
        }
        if (yesVotes > noVotes && cumulativeVotes >= maxVotes) {
            state = ProjectState.inExecution;
        } else {
            state = ProjectState.rejected;
        }
    }
}
