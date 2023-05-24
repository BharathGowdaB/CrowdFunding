//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { MilestoneState, MilestoneDetails } from '../utils/definitions.sol';
import { votingPeriod } from '../utils/constants.sol';
import { Project } from './project.sol';
import { User } from '../user/user.sol';

contract Milestone {
    address immutable projectId;
    uint immutable returnAmount;
    string private title;
    string private description;
    MilestoneState public state;

    uint private fundsRequired;  
    uint private startTime;

    mapping(address => bool) public votes;
    uint private maxVotes;
    uint public cumulativeVotes;

    constructor(address _projectAddress, string memory _title, string memory _description, uint _fundsRequired,  uint _maxVotes, uint _returnAmount ) {
        projectId = _projectAddress;
        title = _title;
        description = _description;
        fundsRequired = _fundsRequired;
        maxVotes = _maxVotes;
        state = MilestoneState.inVoting;
        cumulativeVotes = _maxVotes;
        returnAmount = _returnAmount;
        startTime = block.timestamp;
    }
    
    function getMilestoneDetails()
        public view returns(MilestoneDetails memory) {
            return MilestoneDetails(title, description,startTime, state, fundsRequired, returnAmount);
        }

    function updateVote(bool _reject) 
        public {
            require(votes[msg.sender] != _reject, '449');
            require(block.timestamp < startTime + votingPeriod, '452');

            uint value = Project(projectId).backers(msg.sender);
            require(value > 0, "453");

            if(_reject){
                cumulativeVotes -= value;
            } else {
                cumulativeVotes += value;
            }

            votes[msg.sender] = _reject;
        }   

    function changeState(MilestoneState _state) 
        public {
            require(msg.sender == projectId, '401');
            state = _state;
        }

    function getVotingResult() 
        public view returns(bool) {
            return (2 * cumulativeVotes >= maxVotes);
        }

}
