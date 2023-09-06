const { JsonRpcProvider } = require("@ethersproject/providers")
const { Wallet } = require("@ethersproject/wallet")
const { Contract, utils } = require("ethers") 
const dotenv = require("dotenv")
const Big = require('big.js')
const abi = require('./abi.json')
const fs = require('fs')
const _ = require("lodash")
const fetch = require('cross-fetch')
let prediction = 0 

const result = dotenv.config()
if (result.error) {
    throw result.error
}

const Web3 = require('web3')
const w = new Web3(process.env.BSC_RPC)

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]
////        BNB/USD price contract
const priceFeed = new w.eth.Contract(aggregatorV3InterfaceABI, process.env.PRICE_ADDRESS)

const wallet = w.eth.accounts.wallet.add(w.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY))
w.eth.defaultAccount = w.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address

const signer = new Wallet(
    process.env.PRIVATE_KEY,
    new JsonRpcProvider(process.env.BSC_RPC)
)

let contract = new Contract(process.env.PCS_ADDRESS.toString(), JSON.parse(abi.result), signer)

const predictionContract = contract.connect(
    signer
)
const checkBalance = async(amount) => {
    let balance = await getBalance()
    if (balance < parseFloat(amount)) {
        console.log("You don't have enough balance :", amount, "BNB", "|", "Actual Balance:", balance, "BNB")
        return false
    } else {
        console.log(`Your balance is enough: ${balance} BNB`)
        return true
    }
}

const getBalance = async()=>{
    return Web3.utils.fromWei(await w.eth.getBalance(wallet.address), 'ether') 
}

const getRoundData = async (round) => {
    try {
        const data = await contract.functions.rounds(round)
        const lockTimestamp = Number(data.lockTimestamp)
        const closeTimestamp = Number(data.closeTimestamp)
        const closePrice = data.closePrice
        const lockPrice = data.lockPrice
        const bullAmount = data.bullAmount
        const bearAmount = data.bearAmount
        const totalAmount = new Big(data.totalAmount)
        const bullPayout = totalAmount.div(bullAmount).round(3).toString()
        const bearPayout = totalAmount.div(bearAmount).round(3).toString()

        const parsedRound = [{
            round: round.toString(), 
            closeTimestamp,
            lockTimestamp,
            openPrice: utils.formatUnits(data.lockPrice, "8"),
            closePrice: utils.formatUnits(data.closePrice, "8"),
            bullAmount: utils.formatUnits(data.bullAmount, "18"),
            bearAmount: utils.formatUnits(data.bearAmount, "18"),
            bullPayout: bullPayout,
            bearPayout: bearPayout,
            winner: closePrice.gt(lockPrice) ? 'bull' : 'bear',
        }]
        // console.log(`${parsedRound[0].round} - closePrice: ${parsedRound[0].closePrice}`)
        return parsedRound
    } catch (e) {
        console.log('getRoundData')
        console.log(e)
        return null
    }
}

const getBNBPrice = async () => {
    try{
        return Number(utils.formatUnits((await priceFeed.methods.latestRoundData().call()).answer, "8"))    
    }catch(err){
        console.log('bnbprice', err.message)
    }
    
}

module.exports = {predictionContract, checkBalance, getBNBPrice, getRoundData }
