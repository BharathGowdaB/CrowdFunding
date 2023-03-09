// SPDX-License-Identifier: MIT
pragma solidity  <0.8.0 ;

contract project {
    uint public id;
    string public title;
    string public description;
    address public creator;
    uint public milestones;
    uint public amount_raised;
    uint public amount_received;
    mapping(address=>uint) public backers;
    address[] public addresses;
    enum state{
        begin, intermediate,end
    }
    state public stateValue;

    constructor(uint _milestones){
        creator = msg.sender;
        milestones  = _milestones;
    }

    function getProjectDetails() public view returns(address, uint, string memory, uint, uint,address[] memory,uint[] memory,uint){
        address[] memory allAddresses = new address[](addresses.length);
        uint[] memory allDeposits = new uint[](addresses.length);
        for(uint i=0; i<addresses.length;i++) {
            allAddresses[i] = addresses[i];
            allDeposits[i] = backers[addresses[i]];
        }
        return (creator,id,description,amount_received,amount_raised,allAddresses,allDeposits,milestones);
    }

    function createMilestones(uint _milestones) public  {
        require(amount_received == milestones, "Insufficient funds can't create a new milestone");
        milestones = _milestones;
    }

    function changeState() public {
        if(amount_received <= milestones){
            stateValue = state.begin;
        }
        else if(amount_received == milestones){
            stateValue = state.intermediate;
        }
        else {
            stateValue = state.end;
        }
    }

    function abortProject() public {
        require(msg.sender == creator);
        selfdestruct(payable(creator));
    }

    function distributeReward() public {

    }

}
