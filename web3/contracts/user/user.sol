//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { maxGetProjectList} from '../utils/constants.sol';
import { SortData } from '../utils/definitions.sol';


contract User{
    address public id;
    string internal name;
    bytes internal email;
    bytes32 internal password;
    address[] internal projectList;

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

    function getProjectList(SortData memory _sorter) public view returns(address[] memory, uint)
    {
        assert(_sorter.skip <= projectList.length);
        uint start = _sorter.skip;
        uint end;

        end = (start + maxGetProjectList);

        if(end > projectList.length) end = projectList.length;

        address[] memory list = new address[](end - _sorter.skip);

        for(uint i = start ; i < end ; i++ ){
            list[i - start] = projectList[i];
        }

        return (list, projectList.length);
  }

}
