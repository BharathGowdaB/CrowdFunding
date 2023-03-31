//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { MilestoneState } from '../utils/definitions.sol';
import { votingPeriod } from '../utils/constants.sol';
import { Project } from './project.sol';
import { User } from '../user/user.sol';

contract Milestone {
    address private projectId;
    string private title;
    string private description;
    MilestoneState public state;

    uint public fundsRequired;
    uint public startTime;

    mapping(address => bool) rejectVotes;
    uint private maxVotes;
    uint private cumulativeRejectVotes;

    constructor( string memory _title, string memory _description, uint _fundsRequired,  uint _maxVotes ) {
        projectId = msg.sender;
        title = _title;
        description = _description;
        fundsRequired = _fundsRequired;
        maxVotes = _maxVotes;
        state = MilestoneState.inVoting;
        cumulativeRejectVotes = 0;
    }

    function updateVote(bool _vote) 
        public {
            require(block.timestamp > startTime + votingPeriod, '452');

            uint value = Project(projectId).backers(msg.sender);
            require(value > 0, "453");
        
            if(rejectVotes[msg.sender] != _vote) return;

            if(_vote){
                cumulativeRejectVotes -= value;
            }else {
                cumulativeRejectVotes += value;
            }

            rejectVotes[msg.sender] = !_vote;
        }   

    function changeState(MilestoneState _state) 
        public {
            require(msg.sender == projectId, '401');
            state = _state;
        }
    function getVotingResult() 
        public view returns(bool) {
            return (2 * cumulativeRejectVotes <= maxVotes);
        }

}
