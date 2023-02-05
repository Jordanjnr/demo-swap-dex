import React, { useEffect, useState } from "react";
import { polygon } from "../tokens/polygon.js";
import useTokenBalances from "./useTokenBalances.jsx";
import { ethers } from "ethers";

const FetchBalances = (props) => {
  const [usersAddress, setUsersAddress] = useState("");
  useEffect(() => {
    const provider =
      window.ethereum && new ethers.providers.Web3Provider(window.ethereum);
    const connect = async () => {
      let accounts = await provider?.send("eth_requestAccounts", []);
      let account = accounts[0];
      setUsersAddress(account);
    };
    connect();
  }, []);

  const tokenBalances = useTokenBalances(polygon, usersAddress);
  console.log(tokenBalances);
  return <></>;
};

export default FetchBalances;
