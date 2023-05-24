module.exports = {
  VerificationState : {
    "initial": 0,
    "inProgress":  1,
    "failed": 2,
    "verified": 3
  },
  
  ProjectState:{
    "initial": 0,
    "inFunding":  1,
    "inExecution": 2,
    "ended": 3,
    "rejected": 4,
    "aborted": 5
  },

  MilestoneState: {
    "initial": 0,
    "inVoting": 1,
    "inExecution": 2,
    "rejected": 3,
    "ended": 4
  },

  BackerOption: {
    "start": 0,
    "refund": 1,
    "milestone": 2,
    "end": 3
  }
}
