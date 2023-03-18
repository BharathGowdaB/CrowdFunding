pragma solidity >=0.7.0 <0.9.0;

//import { User } from './user.sol';
//import { ProjectGeneric } from './project.sol';
import { maxGetProjectList, maxGetStarterList} from './utils/constant.sol';

contract Database {
  address[] internal starterList;
  address[] internal projectList;

  function addStarter(address _starter) public {
    starterList.push(_starter);
  }

  function addProject(address _project) public {
    projectList.push(_project);
  }
}

contract DatabaseSorter is Database {
  function getStarterList(uint _skip) public view returns(address[] memory){
      assert(_skip <= starterList.length);
    
      uint length = (_skip + maxGetStarterList <= starterList.length) ? maxGetStarterList : (starterList.length - _skip);
      address[] memory list = new address[](length);

      for(uint i = 0 ; i < length ; i++ ){
            list[i] = starterList[i + _skip];
      }
        
      return (list);
  }

  function getProjectList(uint _skip) public view returns(address[] memory){
      assert(_skip <= projectList.length);
    
      uint length = (_skip + maxGetProjectList <= projectList.length) ? maxGetProjectList : (projectList.length - _skip);
      address[] memory list = new address[](length);

      for(uint i = 0 ; i < length ; i++ ){
          list[i] = address(projectList[i + _skip]);
      }
        
      return list;
  }
}