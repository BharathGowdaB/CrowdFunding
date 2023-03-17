pragma solidity >=0.7.0 <0.9.0;

contract User{
    address public id;
    string public name;
    bytes internal email;
    bytes32 internal password;

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
}
