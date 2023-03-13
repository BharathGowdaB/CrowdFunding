pragma solidity >=0.7.0 <0.9.0;
import {User} from './user.sol';
import {Project} from './project.sol';

contract Starter is User{
    Project[] private projectList;

    constructor(address _address, string memory _name, bytes memory _email, bytes memory _password)
    User(_address, _name, _email, _password){}

    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _endDate) public {
        require(id == msg.sender);
        projectList.push(new Project(_title,_description, _amountRequired, _endDate));
    }

    function getProjectList(uint skip) public view returns(address[] memory){
        assert(skip <= projectList.length);
    
        uint length = skip + maxGetProjectList <= projectList.length ? maxGetProjectList : projectList.length - skip;
        address[] memory list = new address[](length);

        for(uint i = 0 ; i < length ; i++ ){
            list[i] = projectList[i + skip];
        }
        
        return list;
    }
}
