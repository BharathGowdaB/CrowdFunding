//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

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

    function authenticate(address _address, string memory _email, string memory _password) 
        public view returns (address) {
            require(id == _address, "401");

            bytes memory _emailBytes = bytes(_email);
            require(_emailBytes.length == email.length, '401');
            require(password == sha256(bytes.concat(_emailBytes, bytes(_password))), '401');

            return address(this);
        }

    function getDetails() 
        public view returns(string memory, string memory, uint) {
            return (name, string(email), projectList.length);
        }  


    function getProjectList(uint index) 
        public view returns(address, uint) {
            if(projectList.length < 0) return (address(0), 0);
            return (projectList[index], projectList.length);
        }

}
