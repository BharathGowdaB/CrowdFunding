// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract project {
    string private title;
    string private description;
    address private creator;
    uint private amountRequired;
    uint private amountRaised;

    enum state{
        begin, intermediate, end
    }
    state private stateValue;

    address[] private milestones;
    mapping(address => uint) private backers;

    constructor(string memory _title, string memory _description, uint _amountRequired){
        creator = msg.sender;
        title = _title;
        description = _description;
        amountRaised = 0;
        amountRequired = _amountRequired;
        changeState(state.begin);
    }

    function getProjectDetails() public view 
        returns(address, string memory, string memory, uint, uint){
            return (creator, title, description, amountRequired, amountRaised);
        }
    
    function fundProject() public payable {
        assert(msg.sender != creator);
        assert(stateValue != state.end);

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

    function changeState(state _state) internal {
        stateValue = _state;
    }

    function abortProject() public {
        if(stateValue == state.begin){
            require(msg.sender == creator);
            return;
        }

        // Voting 
    }

}
