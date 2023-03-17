pragma solidity >=0.7.0 <0.9.0;

import { ProjectState } from './utils/definations.sol';

contract ProjectGeneric {
    string internal title;
    string internal description;
    address internal creator;
    uint internal amountRequired;
    uint internal amountRaised;
    uint internal startTime;
    uint internal endTime;

    ProjectState internal state;

    address[] internal milestones;
    mapping(address => uint) internal backers;

    constructor(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration){
        startTime= block.timestamp;
        require(_fundingDuration > 1 hours, 'Cannot End Project Before Starting');
        creator = msg.sender;
        title = _title;
        description = _description;
        amountRaised = 0;
        amountRequired = _amountRequired;
        endTime = startTime + _fundingDuration;
        changeState(ProjectState.initial);
    }

    function getProjectDetails() public view 
        returns(address, string memory, string memory, uint, uint){
            return (creator, title, description, amountRequired, amountRaised);
        }
    
    function changeState(ProjectState _state) internal {
        state = _state;
    }

}

contract Project is ProjectGeneric {

    constructor(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    ProjectGeneric(_title, _description , _amountRequired, _fundingDuration) { }

    function fundProject() public payable {
        assert(msg.sender != creator);
        assert(state != ProjectState.ended);

        backers[msg.sender] = msg.value;
        amountRaised += msg.value;
    }

    function getMilestones() public view
        returns(address[] memory){
            address[] memory milestoneList = milestones;
            return milestoneList;
        }

    function createMilestones() public  {
        address temp = address(0x112211);
        milestones.push(temp);
    }

    

    function abortProject() public view{
        if(state == ProjectState.initial){
            require(msg.sender == creator);
        }

        // Voting 
    }
}
