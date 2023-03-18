pragma solidity >=0.7.0 <0.9.0;

import { Project } from './project.sol';
import { maxGetProjectList} from './utils/constant.sol';

contract User{
    address public id;
    string internal name;
    bytes internal email;
    bytes32 internal password;
    Project[] internal projectList;

    constructor (address _address, string memory _name, string memory _email, string memory _password){
        id = _address;
        name = _name;
        email = bytes(_email);
        password = sha256(bytes.concat(email, bytes(_password))); 
    }

    function authenticate(address _address, string memory _email, string memory _password) public view returns (address) {
        assert(id == _address);
        bytes memory _emailBytes = bytes(_email);
        assert(_emailBytes.length == email.length);
        assert(password == sha256(bytes.concat(_emailBytes, bytes(_password))));

        return address(this);
    }

    function getDetails() public view returns(string memory, string memory, uint){
        return (name, string(email), projectList.length);
    }

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
