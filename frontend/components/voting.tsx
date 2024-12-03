"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
// import { ethers } from 'ethers'

// This is a placeholder for your actual smart contract ABI
// const contractABI = [
//   // Add your contract ABI here
// ]

const contractAddress = "YOUR_CONTRACT_ADDRESS"

export default function Voting() {
  const [isVoting, setIsVoting] = useState(false)

  // const vote = async (choice: boolean) => {
  //   setIsVoting(true)
  //   try {
  //     if (typeof window.ethereum !== 'undefined') {
  //       await window.ethereum.request({ method: 'eth_requestAccounts' })
  //       const provider = new ethers.providers.Web3Provider(window.ethereum)
  //       const signer = provider.getSigner()
  //       const contract = new ethers.Contract(contractAddress, contractABI, signer)

  //       const transaction = await contract.vote(choice)
  //       await transaction.wait()
  //       console.log('Vote submitted successfully')
  //     } else {
  //       console.log('Please install MetaMask!')
  //     }
  //   } catch (error) {
  //     console.error('Error voting:', error)
  //   }
  //   setIsVoting(false)
  // }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Vote on Content Validity</h2>
      <div className="flex space-x-4">
        {/* <Button onClick={() => vote(true)} disabled={isVoting}>
          Valid
        </Button>
        <Button onClick={() => vote(false)} disabled={isVoting}>
          Invalid
        </Button> */}
      </div>
    </div>
  )
}

