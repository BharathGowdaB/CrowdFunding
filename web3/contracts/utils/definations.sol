pragma solidity >=0.7.0 <0.9.0;

enum VerificationState {
    initial, inProgress, failed, verified
}

struct AttestData {
    string name;
    string panNumber;
}

struct VerificationData {
    uint lastUpdate;
    AttestData  data;
    VerificationState state;
}