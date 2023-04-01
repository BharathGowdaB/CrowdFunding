module.exports = {
    minUpdateGap : {
        type: 'uint',
        value: '4 hours',
        realValue: 4 * 60 * 60
    },
    maxGetProjectList: {
        type: 'uint',
        value: '10',
        realValue: 10
    },
    maxGetMilestoneList: {
        type: 'uint',
        value: '10',
        realValue: 10
    },
    maxGetStarterList: {
        type: 'uint',
        value: '10',
        realValue: 10
    },
    votingPeriod: {
        type:'uint',
        value: '24 hours',
        realValue: 24 * 60 * 60,
    },
    minFundingPeriod: {
        type: 'uint',
        value: '1 hours',
        realValue: 60 * 60
    },
    fundingDenomination: {
        type: 'uint',
        value: '10',
        realValue: 10
    }
}