import logo from './logo.svg';
import './App.css';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import { Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import "./styles/home.css";
import { useState } from 'react';

const stakingAddress = "0x976B5cCAEA44c771b2b758c64620C412dCF76AEF"; // Staking Contract
const ustechTokenAddress = "0xA4CC231a10AcF6d714d089fE1653eA5EfEfC0361"; // Ustech Token Address
function App() {

  const { contract: stakingContract, isLoading: isStakingContractLoading   } = useContract(stakingAddress);
  const {contract: ustechToken,isLoading: isUstechTokenLoading} = useContract(ustechTokenAddress);

  console.log(ustechToken);
  const address = useAddress();
  const { data, isLoading } = useContractRead(stakingContract, "getStakeInfo", [address])
  const[amountToStake,setAmountToStake] = useState(0);

  return (
    <>
      <div className="container">
        <main className="main">
          <h1 className="title">Welcome to staking app!</h1>

          <p className="description">
            Stake certain amount and get reward tokens back!
          </p>

          <div className="connect">
            <ConnectWallet />
          </div>

          <div className="stakeContainer">
            <input className="textbox" 
                   type="number" 
                   value={amountToStake} 
                   onChange={(e) => setAmountToStake(e.target.value)} />

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {
                // ERC20 tokeni degisken olarak olusturmam lazim
                await ustechToken.setAllowance(stakingAddress,amountToStake);

                await contract.call(
                  "stake",
                [ethers.utils.parseEther(amountToStake)])
              }}
              theme="dark"
            >
              Stake
            </Web3Button>

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {

                await contract.call(
                  "withdraw",
                [ethers.utils.parseEther(amountToStake)])

              }}
              theme="dark"
            >
              UnStake (Withdraw)
            </Web3Button>

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {

                await contract.call("claimRewards")
                
              }}
              theme="dark"
            >
              Claim Rewards!
            </Web3Button>
          </div>

          <div className="grid">
            <a className="card">
              Staked: {data?._tokensStaked && ethers.utils.formatEther(data?._tokensStaked)} UT <br></br>
            </a>
            <a className="card">
              Rewards: {data?._rewards && Number(ethers.utils.formatEther(data?._rewards)).toFixed(2)} MET
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
