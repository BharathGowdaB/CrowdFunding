import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import { Address } from '../constants/index';

import { checkMetamaskConnection } from "../utils/index";

// Has to change
Address.stratUpAddress = '0x006f04Fa3529EAAc114ff23a7906A1D8943cfFF5';

const StateContext = createContext();


export const StateContextProvider = async ({ children }) => {
  
  // const { contract} = useContract(Address.dbAddress);
  // const { contract: CrowdfundingContract } = useContract(Address.crowdfundingAddress);
  // const { contract: StarterContract } = useContract(Address.stratUpAddress);


 
  checkMetamaskConnection()

  const provider = new ethers.providers.Web3Provider(window.ethereum)

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()
  console.log(provider, signer)
  // console.log(19 , contract, Address.dbAddress)
  // const { mutateAsync: createCampaign } = useContractWrite(StarterContract, 'createProject');
  const dbcontract = new ethers.Contract(Address.dbAddress, 
    [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_projectAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_body",
            "type": "string"
          }
        ],
        "name": "addLogMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_projectAddress",
            "type": "address"
          }
        ],
        "name": "addProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_starter",
            "type": "address"
          }
        ],
        "name": "addStarter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "admin",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "_array",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "_count",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_maxLimit",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skip",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "noSort",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "recent",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "popular",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyCharity",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyStartup",
                "type": "bool"
              }
            ],
            "internalType": "struct SortData",
            "name": "_sorter",
            "type": "tuple"
          }
        ],
        "name": "getListItems",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_projectAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getLogMessage",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "id",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "body",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "timpstamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct LogMessage",
            "name": "",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skip",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "noSort",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "recent",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "popular",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyCharity",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyStartup",
                "type": "bool"
              }
            ],
            "internalType": "struct SortData",
            "name": "_sorter",
            "type": "tuple"
          }
        ],
        "name": "getProjectList",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "projectList",
            "type": "address[]"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skip",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "noSort",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "recent",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "popular",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyCharity",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyStartup",
                "type": "bool"
              }
            ],
            "internalType": "struct SortData",
            "name": "_sorter",
            "type": "tuple"
          }
        ],
        "name": "getSortedProjects",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skip",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "noSort",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "recent",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "popular",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyCharity",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "onlyStartup",
                "type": "bool"
              }
            ],
            "internalType": "struct SortData",
            "name": "_sorter",
            "type": "tuple"
          }
        ],
        "name": "getStarterList",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_charityLamdaAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_startupLamdaAddress",
            "type": "address"
          }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ], provider);

  const contract = dbcontract;

  const CrowdfundingContract = new ethers.Contract('0x58feAC690DFDc49A6B0ce5B2382F82f28ce1Cd2c',
    [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "email",
            "type": "string"
          }
        ],
        "name": "isEmail",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "password",
            "type": "string"
          }
        ],
        "name": "isPassword",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          }
        ],
        "name": "isTitle",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ]
    , signer)

  try{
    console.log(ethers.BigNumber.from(10))

    //console.log(await CrowdfundingContract.isEmail("dhfigmail.com"))
    //console.log(await contract.admin())
    console.log(await contract.functions.getProjectList([0, false, false, false, false,false] ))
  } catch(err){
    console.log(err)
  }
  
  console.log(406, contract, CrowdfundingContract)
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    // try {
    //   const data = await createCampaign([
    //     address, // owner
    //     form.title, // title
    //     form.description, // description
    //     form.target,
    //     new Date(form.deadline).getTime(), // deadline,
    //     form.image
    //   ])

    //   console.log("contract call success", data)
    // } catch (error) {
    //   console.log("contract call failure", error)
    // }
  }

  const getCampaigns = async () => {
    
    const campaigns = await DatabaseContract.call('getProjectList',[{skip: 0}]);
    console.log(38, campaigns)
    
    // const parsedCampaings = campaigns.map((campaign, i) => ({
    //   owner: campaign.owner,
    //   title: campaign.title,
    //   description: campaign.description,
    //   target: ethers.utils.formatEther(campaign.target.toString()),
    //   deadline: campaign.deadline.toNumber(),
    //   amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
    //   image: campaign.image,
    //   pId: i
    // }));

    // return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    // const allCampaigns = await getCampaigns();

    // const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    // return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    // const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});

    // return data;
  }

  const getDonations = async (pId) => {
    // const donations = await contract.call('getDonators', pId);
    // const numberOfDonations = donations[0].length;

    // const parsedDonations = [];

    // for(let i = 0; i < numberOfDonations; i++) {
    //   parsedDonations.push({
    //     donator: donations[0][i],
    //     donation: ethers.utils.formatEther(donations[1][i].toString())
    //   })
    // }

    // return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);