import { useState, useEffect } from "react";
import { contractAbi } from "../tokens/abi.js";
import axios from "axios";
const ethers = require("ethers");

async function getTokenBalances(tokens, userAddress) {
  // Initialize empty array to store token balances
  const tokenBalances = [];

  // Loop through each token object in the array
  for (const token of tokens) {
    // Use ethers.js to query the user's balance of the token
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(token?.address, contractAbi, provider);
    const balance = await contract?.balanceOf(userAddress);
    // Push the token address and balance into the new array
    tokenBalances.push({
      address: token?.address,
      balance: String(balance / token?.decimals),
      symbol: token?.symbol,
      logo: token?.logoURI,
      decimals: token?.decimals,
    });
  }

  console.log(tokenBalances);

  return tokenBalances;
}

export default function useTokenBalances(tokens, userAddress) {
  const [tokenBalances, setTokenBalances] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Query the token balances using the function from the previous example
      const balances = await getTokenBalances(tokens, userAddress);
      setTokenBalances(balances);
    }
    fetchData();
  }, [tokens, userAddress]);

  return tokenBalances;
}
