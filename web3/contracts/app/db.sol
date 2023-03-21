//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from '../user/user.sol';
import { Charity } from '../project/charity.sol';
import { Startup } from '../project/startup.sol';
import { maxGetProjectList, maxGetStarterList} from '../utils/constant.sol';

contract Database {
  address public admin;
  address[] internal starterList;
  address[] internal projectList;

  function updateAdmin() public {
    require(admin == address(0), "401");
    admin = msg.sender;
  }

  function addStarter(address _starter) public {
    require(admin == msg.sender, "401");
    starterList.push(_starter);
  }

  function addProject(string memory _title, string memory _description, uint _amountRequired, uint _fundingDuration, bool _isCharity) public returns(address){
      if(_isCharity)
          projectList.push(address(new Charity(msg.sender, _title,_description, _amountRequired, _fundingDuration)));
      else
          projectList.push(address(new Startup(msg.sender, _title,_description, _amountRequired, _fundingDuration)));

      return projectList[projectList.length -  1];
  }

}

contract DatabaseSorter is Database {

  function getStarterList(uint _skip) public view returns(address[] memory, uint){
      return sorter(starterList, maxGetStarterList, _skip);
  }

  function getProjectList(uint _skip) public view returns(address[] memory, uint){
      return sorter(projectList, maxGetProjectList, _skip);
  }

  function sorter(address[] storage array, uint maxLimit, uint _skip) internal view returns(address[] memory, uint){
    assert(_skip <= array.length);
    
    uint length = (_skip + maxLimit <= array.length) ? maxLimit : (array.length - _skip);
    address[] memory list = new address[](length);

    for(uint i = 0 ; i < length ; i++ ){
        list[i] = array[i + _skip];
    }
        
    return (list, array.length);
  }

}