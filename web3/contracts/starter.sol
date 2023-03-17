pragma solidity >=0.7.0 <0.9.0;
import { User } from './user.sol';
import { Project } from './project.sol';
import { maxGetProjectList} from './utils/constant.sol';
import { dbAddress } from './utils/db.address.sol';
import { Database } from './db.sol';

contract StarterGeneric is User{
    Project[] internal projectList;

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        User(_address, _name, _email, _password){}

    function getProjectList(uint _skip) public view 
        returns(address[] memory) {
            assert(_skip <= projectList.length);
    
            uint length = (_skip + maxGetProjectList <= projectList.length) ? maxGetProjectList : (projectList.length - _skip);
            address[] memory list = new address[](length);

            for(uint i = 0 ; i < length ; i++ ){
                list[i] = address(projectList[i + _skip]);
            }
        
            return list;
        }
}


contract Starter is StarterGeneric{

    constructor(address _address, string memory _name, string memory _email, string memory _password)
        StarterGeneric(_address, _name, _email, _password){}


    function createProject(string memory _title, string memory _description, uint _amountRequired, uint _endDate) public 
        {
            require(id == msg.sender, 'UnAuthorized');

            projectList.push(new Project(_title,_description, _amountRequired, _endDate));
            Database(dbAddress).addProject(address(projectList[projectList.length - 1]));
        }
}
