import logo from './logo.svg';
import './App.css';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";

import {ethers} from "ethers";

function App() {

  const {contract} = useContract("0x976B5cCAEA44c771b2b758c64620C412dCF76AEF");
  const address = useAddress();

  console.log("address",address);

  const { data, isLoading } = useContractRead(contract, "getStakeInfo", [address])
  
  console.log(data);

  return (
    <>
      <ConnectWallet />
      <br></br>

      Staked: {data?._tokensStaked && ethers.utils.formatEther(data?._tokensStaked)} UT <br></br>
      Rewards: {data?._rewards && Number(ethers.utils.formatEther(data?._rewards)).toFixed(2)} MET
    </>
  );
}

export default App;
