//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import { Crowdfunding } from "./crowdfunding.sol";

import { User } from "../user/user.sol";
import { Project } from "../project/project.sol";

import { maxGetProjectList, maxGetStarterList } from "../utils/constants.sol";
import { SortData } from "../utils/definitions.sol";

contract Database {
    address public admin;
    address internal charityLamdaAddress;
    address internal startupLamdaAddress;

    address[] internal starterList;
    address[] internal projectList;

    function init(address _charityLamdaAddress, address _startupLamdaAddress)
        public {
            require(admin == address(0), "602");
            require(charityLamdaAddress == address(0), "602");
            require(startupLamdaAddress == address(0), "602");

            admin = msg.sender;
            charityLamdaAddress = _charityLamdaAddress;
            startupLamdaAddress = _startupLamdaAddress;
        }

    function addStarter(address _starter) 
        public {
            require(admin == msg.sender, "401");
            starterList.push(_starter);
        }

    function addProject(address _projectAddress) 
        public {
            require( (msg.sender == charityLamdaAddress || msg.sender == startupLamdaAddress), "401");
            projectList.push(_projectAddress);
        }
}

contract DatabaseSorter is Database {
    
    function getListItems( address[] memory _array, uint _count, uint _maxLimit, SortData memory _sorter) 
        internal pure returns(address[] memory, uint) {
            if(_sorter.skip >= _count) _sorter.skip = _count;
            uint end;
            uint start;

            start = _sorter.skip;
            end = (start + _maxLimit);

            if (end > _count) end = _count;

            address[] memory list = new address[](end - start);

            for (uint i = start; i < end; i++) {
                list[i - start] = _array[i];
            }

            return (list, _count);
        }

    function getStarterList(SortData memory _sorter)
        public view returns (address[] memory, uint) {
              return getListItems( starterList, starterList.length, maxGetStarterList, _sorter );
        }

    function getSortedProjects(SortData memory _sorter)
        internal view returns(address[] memory, uint) {
            if (_sorter.noSort) return (projectList, projectList.length);
            
            if (!(_sorter.recent || _sorter.popular || _sorter.onlyCharity ||_sorter.onlyStartup)) return (projectList, projectList.length);

            address[] memory sortedList = new address[](projectList.length);
            uint k = 0;
            if (_sorter.onlyCharity) {
                for (uint i = 0; i < projectList.length; i++) {
                    if (Project(projectList[i]).isCharity()) {
                        sortedList[k++] = projectList[i];
                    }
                }
            } else if (_sorter.onlyStartup) {
                for (uint i = 0; i < projectList.length; i++) {
                    if (!Project(projectList[i]).isCharity()) {
                        sortedList[k++] = projectList[i];
                    }
                }
            } else {
                k = projectList.length;
            }

            if (_sorter.recent) {
                for (uint i = 0; i < projectList.length; i++) {
                    sortedList[projectList.length - i - 1] = projectList[i];
                }
            } else if (_sorter.popular) {
                for (uint i = 0; i < k; i++) {
                    uint j;
                    uint curAmtRaised = Project(projectList[i]).amountRaised();
                    for (j = i; j > 0; j--) {
                        if ( curAmtRaised <= Project(sortedList[j - 1]).amountRaised() ) break;
                        
                        sortedList[j] = sortedList[j - 1];
                    }
                    sortedList[j] = projectList[i];
                }
            }

            return (sortedList, k);
        }

    function getProjectList(SortData memory _sorter)
        public view returns (address[] memory, uint) {
            address[] memory list;
            uint count;
            
            (list, count) = getSortedProjects(_sorter);

            return getListItems(list, count, maxGetProjectList, _sorter);
        }
}
