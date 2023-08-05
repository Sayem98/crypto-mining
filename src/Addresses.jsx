import React from 'react'
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {  toast } from 'react-toastify';
function Addresses({ownerAddress,contract, setOwnerAddress, handleSetAddress,showAddress,setShowAddress}) {
  const { address } = useAccount();
  const [owner, setOwner] = useState("");

  useEffect(() => {
    const getOwnerAddress = async () => {
      if(!contract) return;
      const owner = await contract.methods.owner().call();
      console.log("owner: ", owner);
      setOwner(owner);
      if (owner === address){
        setShowAddress(true);
      }else{
        setShowAddress(false);
      }
    }
    getOwnerAddress();
  }, [address, owner]);

  return (
    <div>
      { showAddress ?
        <div className='flex flex-col md:flex-row items-center justify-center gap-3'>
        <input type="text" placeholder='Enter owner address' 
          className='p-3 w-full md:w-[22rem] text-lg text-gray-600 focus:outline-none font-serif rounded-md'
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
        />
      <button className='bg-[#4c50ac] hover:bg-[#6063cc] p-3 text-xl font-bold w-full md:w-fit rounded-md' onClick={handleSetAddress}>Set Address</button>
      </div>: ""
      }
    </div>
  )
}
export default Addresses;

