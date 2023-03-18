pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';
import { Milestone } from './milestone.sol';

contract Startup is Project {
    Milestone[] internal milestoneList;

    constructor(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration)
    Project(_title, _description , _amountRequired, _fundingDuration, false) { }

    function addMileStone() public {
        // your logic
    }

    function getMilestones(uint _skip) public view
        returns(address[] memory){
           // your logic
        }

    function voteMileStone(address _milestoneAddress, bool vote) public {
        // your logic
    }

    function releaseMilestoneFunds(address _mileStoneAddress) public {
        // your logic
    }

    function abortProject() public view{
        //your logic
    }
}
