//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { User } from '../user/user.sol';
import { Project } from '../project/project.sol';
import { Charity } from '../project/charity.sol';
import { Startup } from '../project/startup.sol';
import { maxGetProjectList, maxGetStarterList} from '../utils/constants.sol';
import { VerificationState, SortData } from '../utils/definitions.sol';

import { Crowdfunding } from './crowdfunding.sol';
import 'hardhat/console.sol';

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
      require(Crowdfunding(admin).checkStarterVerified(msg.sender) == VerificationState.verified, "401");

      if(_isCharity)
          projectList.push(address(new Charity(msg.sender, _title,_description, _amountRequired, _fundingDuration)));
      else
          projectList.push(address(new Startup(msg.sender, _title,_description, _amountRequired, _fundingDuration)));

      return projectList[projectList.length -  1];
  }

}

contract DatabaseSorter is Database {

  function getListItems(address[] memory _array, uint _count, uint _maxLimit,SortData memory _sorter) internal view 
  returns(address[] memory, uint)
  {
    assert(_sorter.skip <= _count);
    uint start;
    uint end;

    start = _sorter.skip;
    end = (start +_maxLimit);

    if(end > _count) end = _count;

    address[] memory list = new address[](end - start);

    for(uint i = start ; i < end ; i++ ){
      list[i - start] = _array[i];
    }

    return (list, _count);
  }


  function getStarterList(SortData memory _sorter) public view returns(address[] memory, uint)
  {
    return getListItems(starterList, starterList.length, maxGetStarterList, _sorter);
  }

  function getSortedProjects(SortData memory _sorter) internal view returns(address[] memory, uint){
    if(_sorter.noSort) return (projectList, projectList.length);
    if(!(_sorter.recent || _sorter.popular || _sorter.onlyCharity || _sorter.onlyStartup)) return (projectList, projectList.length);

    address[] memory sortedList = new address[](projectList.length);
    uint k = 0;
    if(_sorter.onlyCharity){
        for(uint i = 0 ; i < projectList.length ; i++){
          if(Project(projectList[i]).isCharity()){
            sortedList[k++] = projectList[i];
          }
        }
    }
    else if(_sorter.onlyStartup){
        for(uint i = 0 ; i < projectList.length ; i++){
          if(!Project(projectList[i]).isCharity()){
            sortedList[k++] = projectList[i];
          }
        }
    }
    else{
      k = projectList.length;
    }

    if(_sorter.recent){
      for(uint i = 0 ; i < projectList.length ; i++){
        sortedList[projectList.length - i - 1] = projectList[i];
      }
    }
    else if(_sorter.popular){
      for(uint i = 0; i < k ; i++){
        uint j;
        uint curAmtRaised = Project(projectList[i]).amountRaised();
        for(j = i; j > 0 ; j--){
            if(curAmtRaised <= Project(sortedList[j - 1]).amountRaised()) break;
            sortedList[j] = sortedList[j - 1];
        }
        sortedList[j] = projectList[i];
      }
    }

    return (sortedList , k);
  }

  function getProjectList(SortData memory _sorter) public view returns(address[] memory, uint)
  {
    address[] memory list;
    uint count; 
    (list , count) = getSortedProjects(_sorter);
    return getListItems(list , count , maxGetProjectList, _sorter);
  }




}