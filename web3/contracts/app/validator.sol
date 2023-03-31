//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract Validator {
    
    function isEmail(string memory email) public pure returns (bool) {
        bytes memory emailBytes = bytes(email);
        uint atPosition = 0;
        uint dotPosition = 0;
        
        for (uint256 i = 0; i < emailBytes.length; i++) {
            if (emailBytes[i] == '@') {
                atPosition = i;
            } else if (emailBytes[i] == '.' && i > atPosition) {
                dotPosition = i;
            }
        }
        
        return (atPosition > 0 && dotPosition > (atPosition + 1 ) && (dotPosition + 1) < emailBytes.length);
    }

    function isPassword(string memory password) public pure returns (bool) {
        bytes memory passwordBytes = bytes(password);

        if (passwordBytes.length < 8) { return false; }
    
        bool valid = true;
        bool hasUppercase = false;
        bool hasLowercase = false;
        bool hasNumber = false;
        bool hasSpecial = false;
        
        for (uint i = 0; i < passwordBytes.length; i++) {
            if (passwordBytes[i] >= 'A' && passwordBytes[i] <= 'Z') {
                hasUppercase = true;
            } else if (passwordBytes[i] >= 'a' && passwordBytes[i] <= 'z') {
                hasLowercase = true;
            } else if (passwordBytes[i] >= '0' && passwordBytes[i] <= '9') {
                hasNumber = true;
            } else if(passwordBytes[i] == '@' || passwordBytes[i] == '#' || passwordBytes[i] == '$'){
                hasSpecial = true;
            } else{
                valid = false;
                break;
            } 
        }
    
        return (valid && hasUppercase && hasLowercase && hasNumber && hasSpecial);
    }
    
    function isTitle(string memory title) public pure returns (bool) {
        bytes memory titleBytes = bytes(title);

        for(uint i = 0; i < titleBytes.length ; i++){
            if(titleBytes[i] != ' ') return true;
        }
        return false;
    }
}