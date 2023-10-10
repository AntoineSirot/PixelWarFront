import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Web3 from 'web3';

import Landing from "./pages/Landing.js";
import PixelGrid from "./pages/PixelGrid.js";
import ColorPicker from "./pages/ColorPicker.js";

function App() {
  const [contractAddress, setContractAddress] = useState(null);
  const [contractAbi, setContractAbi] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [tokenAbi, setTokenAbi] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [currentWeb3, setWeb3] = useState(null);

  const [isReadyForWeb3, setIsReadyForWeb3] = useState(null);

  useEffect(() => {
    document.title = "Pixel war front";
  }, []);

  useEffect(() => {
    async function readyForWeb3() {
      const address = process.env.REACT_APP_PIXEL_WAR_CONTRACT_ADDRESS;
      const abi = JSON.parse(process.env.REACT_APP_PIXEL_WAR_CONTRACT_ABI);
      const tokenaddress = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS;
      const tokenabi = JSON.parse(process.env.REACT_APP_TOKEN_ABI);
      const testWeb3 = new Web3(window.ethereum);
      const accounts = await testWeb3.eth.requestAccounts();

      setWeb3(testWeb3);
      setUserAddress(accounts[0]);
      setContractAddress(address);
      setContractAbi(abi);
      setTokenAddress(tokenaddress);
      setTokenAbi(tokenabi);
    }
    readyForWeb3();
    if (contractAddress && contractAbi && tokenAddress && tokenAbi && userAddress && currentWeb3) {
      setIsReadyForWeb3(true);
    }
    else {
      setIsReadyForWeb3(false);
    }
  }, []);

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                contractAddress={contractAddress}
                contractAbi={contractAbi}
                tokenAddress={tokenAddress}
                tokenAbi={tokenAbi}
                web3={currentWeb3}
                userAddress={userAddress}
              />}
          />
          <Route
            path="/pixelGrid"
            element={<PixelGrid contractAddress={contractAddress} contractAbi={contractAbi} />}
          />
          <Route
            path="/test"
            element={<ColorPicker />}
          />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
