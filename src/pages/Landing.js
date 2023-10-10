import './../App.css';
import React, { useEffect, useState } from 'react';
import ColorButton from '../modules/ColorButton';

const Landing = ({ contractAddress, contractAbi, tokenAddress, tokenAbi, web3, userAddress }) => {

    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [index, setIndex] = useState(null);
    const [pixels, setPixels] = useState(null);


    const handleTransfer = async () => {
        try {
            const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
            await tokenContract.methods.transfer(toAddress, web3.utils.toWei(amount, 'ether')).send({ from: userAddress });

            console.log(`Transferred ${amount} tokens to ${toAddress}`);
        } catch (error) {
            console.error('Error transferring tokens:', error);
        }
    };

    const handleGrid = async () => {
        try {
            console.log(contractAbi);
            const contract = new web3.eth.Contract(contractAbi, contractAddress);
            const pixelData = [];
            for (let i = 0; i < 100; i++) {
                const pixel = await contract.methods.pixels(i).call({ from: userAddress });
                pixelData.push(pixel);
                console.log("Pixel ", i + 1, " done :", pixel[0], ", ", pixel[1], ", ", pixel[2]);
            }
            setPixels(pixelData);
        } catch (error) {
            console.error('Error reading pixel caracteristics:', error);
        }
    };

    useEffect(() => {
        handleGrid();
    }, []);

    async function handleBuying(red, blue, green) {
        try {
            const contract = new web3.eth.Contract(contractAbi, contractAddress);

            const price = await contract.methods.currentPrice().call({ from: userAddress });

            await contract.methods.buyPixel(index, [red, blue, green]).send({ from: userAddress, value: price });
            console.log("Pixel n°", index, " bought successfully");
            handleGrid();
        }
        catch (error) {
            console.error('Error buying pixel :', error);
        }
    };

    async function connectToMetaMask() {
        console.log('Connecting to MetaMask...');

        if (typeof window.ethereum !== 'undefined') {
            try {

                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    const walletAddress = accounts[0];
                    console.log('Connected to MetaMask!');
                    console.log('Wallet Address: ' + walletAddress);
                    return walletAddress;
                } else {
                    console.log('No accounts found.');
                }
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            alert('MetaMask not detected');
        }
    }

    useEffect(() => {
        connectToMetaMask();
    }, []);

    return (
        <div className="Main_container">

            <p className='App-header'>🚀 Transfer ERC-20 Tokens 🚀</p>

            <div className="input-container">
                <label>Recipient Address: </label>
                <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                />
            </div>

            <div className="input-container">
                <label>Amount: </label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <button
                className='custom-button '
                onClick={handleTransfer}
            >
                💸 Transfer Tokens 💸
            </button>

            <p className='App-header'>🚀 Pixel War 🚀</p>


            <div className="input-container">
                <label>Pixel's Index: </label>
                <input
                    type="text"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                />
            </div>

            <div className='ButtonsContainer'>
                <ColorButton color="White" onClick={() => handleBuying(255, 255, 255)} />
                <ColorButton color="Red" onClick={() => handleBuying(255, 0, 0)} />
                <ColorButton color="Green" onClick={() => handleBuying(0, 255, 0)} />
                <ColorButton color="Blue" onClick={() => handleBuying(0, 0, 255)} />
                <ColorButton color="Pink" onClick={() => handleBuying(255, 182, 193)} />
            </div>

            {pixels ? (
                <div className="pixel-container">
                    {Array.from({ length: 10 }, (_, rowIndex) => (
                        <div className="pixel-row" key={rowIndex}>
                            {Array.from({ length: 10 }, (_, colIndex) => {
                                const pixelIndex = rowIndex * 10 + colIndex;
                                const pixel = pixels[pixelIndex];
                                return (
                                    <div
                                        key={pixelIndex}
                                        className="pixel"
                                        style={{
                                            backgroundColor: `rgb(${pixel.red}, ${pixel.green}, ${pixel.blue})`,
                                        }}
                                        onClick={() => setIndex(pixelIndex)}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div> Loading Pixel Map ... </div>
            )}

        </div>
    );


}

export default Landing;
