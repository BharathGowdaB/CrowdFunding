//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';
import { Milestone } from './milestone.sol';

import { User } from '../user/user.sol';

import { ProjectState, MilestoneState, SortData } from '../utils/definitions.sol';
import { votingPeriod, maxGetMilestoneList} from '../utils/constants.sol';


contract Startup is Project {
    modifier onlyCreator {
        require(id == msg.sender, "401");
        _;
    }
    address[] internal milestoneList;

    constructor(address _starterId, string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
        Project(_starterId, _title, _description , _amountRequired, _fundingDuration, false) { }

    function addBacker() 
        public override payable {
            require(state == ProjectState.inFunding, "442");
            require(block.timestamp < endTime, "443");
            require((amountRaised + msg.value) <= amountRequired, "446");
            require(msg.value > 0, "432");
            
            amountRaised += msg.value;
            backers[msg.sender] += msg.value;

            for(uint i = 0 ; i < backersList.length ; i++){
                if(backersList[i] == msg.sender) return;
            }

            backersList.push(msg.sender);
        }

    function addMilestone(string memory _title, string memory _description, uint _fundsRequired) 
        public onlyCreator returns(address) {
            milestoneList.push(address(new Milestone(_title, _description, _fundsRequired, amountRaised)));
            return (milestoneList[milestoneList.length - 1]);
        }

    function getMilestoneList(SortData memory _sorter) 
        public view returns(address[] memory, uint) {
            if(_sorter.skip >= milestoneList.length)  _sorter.skip =  milestoneList.length;
            
            uint start = _sorter.skip;
            uint end;

            end = (start + maxGetMilestoneList);

            if(end > milestoneList.length) end = milestoneList.length;

            address[] memory list = new address[](end - _sorter.skip);

            for(uint i = start ; i < end ; i++ ){
                list[i - start] = milestoneList[i];
            }

            return (list, milestoneList.length);
        }

    function releaseMilestoneFunds(address _mileStoneAddress) 
        public onlyCreator {
            Milestone milestone = Milestone(_mileStoneAddress);
            require(milestone.state() == MilestoneState.inVoting, '450');
            require(block.timestamp > (milestone.startTime() + votingPeriod), '451');
        
            if(milestone.getVotingResult()){
                (bool sent,) = payable(id).call{value: milestone.fundsRequired()}("");
                require(sent == true, '500');
                milestone.changeState(MilestoneState.ended);
            }
            else{
                milestone.changeState(MilestoneState.rejected);
            }   
        }
    

    function abortProject() 
        public onlyCreator {
            require(state == ProjectState.inFunding, "445");
            require(block.timestamp < endTime, "447");

        for(uint i = 0 ; i < backersList.length ; i++){
            (bool sent,) = payable(User(backersList[i]).id()).call{value : backers[backersList[i]]}("");
            require(sent == true, '500');
            backers[backersList[i]] = 0;
        }

        state = ProjectState.aborted;
    }
}
