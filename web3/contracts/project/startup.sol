//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';
import { Milestone } from './milestone.sol';

import { User } from '../user/user.sol';

import { ProjectState, MilestoneState , MilestoneDetails} from '../utils/definitions.sol';
import { votingPeriod, fundingDenomination} from '../utils/constants.sol';


contract Startup is Project {
    modifier onlyCreator {
        require(id == msg.sender, "401");
        _;
    }
    address[] internal milestoneList;
    mapping(address => bool) endProjectVotes;

    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
        Project(_starterId, _title, _description , _amountRequired, _fundingDuration, false) { 
            require(_amountRequired % fundingDenomination == 0, "432");
        }

    function addBacker() 
        public override payable {
            require(state == ProjectState.inFunding, "442");
            require(block.timestamp < endTime, "443");
            require(msg.value % fundingDenomination == 0 && msg.value > 0, "432");
            require((amountRaised + msg.value) <= amountRequired, "446");
            
            amountRaised += msg.value;
            backers[msg.sender] += msg.value;

            for(uint i = 0 ; i < backersList.length ; i++){
                if(backersList[i] == msg.sender) return;
            }

            backersList.push(msg.sender);
        }

    function addMilestone(string memory _title, string memory _description, uint _fundsRequired, uint _returnAmount) 
        public onlyCreator returns(address) {
            require(state == ProjectState.inExecution, "448");
            milestoneList.push(address(new Milestone(_title, _description, _fundsRequired, amountRaised, _returnAmount)));
            return (milestoneList[milestoneList.length - 1]);
        }

    function getMilestone(uint index) 
        public view returns(address, uint) {
            if(milestoneList.length <= 0 || index >= milestoneList.length) return (address(0), 0);
            return (milestoneList[index], milestoneList.length);
        }

    function releaseMilestoneFunds(address _milestoneAddress) 
        public onlyCreator {
            Milestone milestone = Milestone(_milestoneAddress);
            MilestoneDetails memory details = milestone.getMilestoneDetails();

            require(details.state == MilestoneState.inVoting, '454');
            require(block.timestamp > (details.startTime + votingPeriod), '451');
        
            if(milestone.getVotingResult() && address(this).balance >= details.fundsRequired){
                (bool sent,) = payable(id).call{value: details.fundsRequired}("");
                require(sent == true, '500');
                milestone.changeState(MilestoneState.inExecution);
            }
            else{
                milestone.changeState(MilestoneState.rejected);
            }   
        }
    
    function endMilestone(address _milestoneAddress)
        public onlyCreator payable{
            Milestone milestone = Milestone(_milestoneAddress);
            MilestoneDetails memory details = milestone.getMilestoneDetails();

            require(details.state == MilestoneState.inExecution, '455');
            require(details.returnAmount == msg.value, "456");

            amountRaised += msg.value;
            milestone.changeState(MilestoneState.ended);
        }
    
    function abortProject() 
        public onlyCreator {
            require(state == ProjectState.inFunding, "445");
            require(block.timestamp < endTime, "447");

            returnBackersFunds(1,1);
            state = ProjectState.aborted;
        }

    function returnBackersFunds(uint multiplier, uint divider)
        internal {
            for(uint i = 0 ; i < backersList.length ; i++){
                (bool sent,) = payable(User(backersList[i]).id()).call{value : (multiplier * backers[backersList[i]]) / divider}("");
                require(sent == true, '500');
                backers[backersList[i]] = 0;
            }
        }

    function startProject()
        public onlyCreator {
            require(state == ProjectState.inFunding, "448");
            require(block.timestamp >= endTime, "440");

            if(amountRaised < amountRequired){
                returnBackersFunds(1,1);
                state = ProjectState.rejected;
            } else{
                state = ProjectState.inExecution;
            }  
        }

    function voteEndProject(bool _vote)
        public {
            require(state == ProjectState.inExecution, "448");
            require(backers[msg.sender] > 0, '401');
            require(endProjectVotes[msg.sender] != _vote, '449');

            endProjectVotes[msg.sender] = _vote;

            uint count = 0;
            for(uint i = 0 ; i < backersList.length ; i++) {
                if(endProjectVotes[backersList[i]]) count += backers[backersList[i]];
            }

            if( 2 * count > amountRequired) {
                returnBackersFunds(address(this).balance, amountRaised);
                state = ProjectState.ended;
            }
        }
}
