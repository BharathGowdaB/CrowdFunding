pragma solidity >=0.7.0 <0.9.0;

enum VerificationState {
    initial, inProgress, failed, verified
}

enum ProjectState{
    initial, inFunding, inExecution, ended, rejected, aborted
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

