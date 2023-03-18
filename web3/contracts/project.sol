pragma solidity >=0.7.0 <0.9.0;

import { ProjectState } from './utils/definations.sol';

contract Project {
    address internal creator;
    string internal title;
    string internal description;
    uint internal amountRequired;
    uint internal amountRaised;
    uint internal startTime;
    uint internal endTime;
    bool internal isCharity = false;

    ProjectState internal state;

    address[] internal milestones;
    mapping(address => uint) internal backers;

    constructor(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity){
        startTime= block.timestamp;
        require(_fundingDuration > 1 hours, 'Cannot End Project Before Starting');
        creator = msg.sender;
        title = _title;
        description = _description;
        amountRaised = 0;
        amountRequired = _amountRequired;
        endTime = startTime + _fundingDuration;
        changeState(ProjectState.initial);
        isCharity = _isCharity;
    }

    function getProjectDetails() public view 
        returns(address, string memory, string memory, uint, uint){
            return (creator, title, description, amountRequired, amountRaised);
        }
    
    function changeState(ProjectState _state) internal {
        state = _state;
    }

    function addBacker(address _backerAddress) public payable {
        require(msg.value > 0, "Must send some Ether");
        require(amountRaised + msg.value <= amountRequired, "Funding goal reached");

        amountRaised += msg.value;
        backers[_backerAddress] += msg.value;

    }

}

