pragma solidity >=0.7.0 <0.9.0;

abstract contract User{
    address internal  id;
    string internal name;
    bytes internal email;
    bytes32 internal password;

    constructor (address _address, string memory _name, bytes memory _email, bytes memory _password){
        id = _address;
        name = _name;
        email = _email;
        password = sha256(bytes.concat(_email, _password)); 
    }

    function authenticate(address _address, bytes memory _email, bytes memory _password) public view returns (address) {
        assert(id == _address);
        assert(_email.length == email.length);
        assert(password == sha256(bytes.concat(_email, _password)));

        return address(this);
    }
}
