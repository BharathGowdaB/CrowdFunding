//SPDX-License-Identifier: UNLICENSED 
pragma solidity >=0.7.0 <0.9.0; 

enum VerificationState {
	initial, inProgress, failed, verified
}

enum ProjectState {
	initial, inFunding, inExecution, ended, rejected, aborted
}

enum MilestoneState {
	initial, inVoting, inExecution, rejected, ended
}

enum BackerOption {
	start, refund, milestone, end
}

struct AttestData {
	string name; 
	string panNumber; 
}

struct VerificationData {
	uint lastUpdate; 
	AttestData data; 
	VerificationState state; 
}

struct SortData {
	uint skip; 
	bool noSort; 
	bool recent; 
	bool popular; 
	bool onlyCharity; 
	bool onlyStartup; 
}

struct LogMessage {
	address id; 
	string body; 
	uint timestamp; 
}

struct MilestoneDetails {
	string title; 
	string description; 
	uint startTime; 
	MilestoneState state; 
	uint fundsRequired; 
	uint returnAmount; 
}

struct ProjectDetails {
	string title; 
	string description; 
	uint amountRequired; 
	ProjectState state; 
	uint backersCount; 
	uint endTime; 
}

