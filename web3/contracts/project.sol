pragma solidity >=0.7.0 <0.9.0;
import {ProjectState} from './utils/definations.sol';

contract Project {
    string private title;
    string private description;
    address private creator;
    uint private amountRequired;
    uint private amountRaised;
    uint private startDate;
    uint private endDate;

    ProjectState private state;

    address[] private milestones;
    mapping(address => uint) private backers;

    constructor(string memory _title, string memory _description, uint _amountRequired, uint _endDate){
        startDate = block.timestamp;
        require(_endDate > startDate, 'Cannot End Project Before Starting');
        creator = msg.sender;
        title = _title;
        description = _description;
        amountRaised = 0;
        amountRequired = _amountRequired;
        endDate = _endDate;
        changeState(ProjectState.initial);
    }

    function getProjectDetails() public view 
        returns(address, string memory, string memory, uint, uint){
            return (creator, title, description, amountRequired, amountRaised);
        }
    
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

    function changeState(ProjectState _state) internal {
        state = _state;
    }

    function abortProject() public view{
        if(state == ProjectState.initial){
            require(msg.sender == creator);
        }

        // Voting 
    }

}
