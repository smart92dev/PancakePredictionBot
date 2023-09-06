const { parseEther } = require("@ethersproject/units")
const { predictionContract, getBNBPrice, checkBalance, getRoundData } = require("./lib")
const {utils} = require('ethers')

// Global Config
const GLOBAL_CONFIG = {
    INIT_BET: 0.005, // in bnb
    START_BET: 0.005,
    TIME_TO_NEXT: 5  //seconds
}

var curBet = GLOBAL_CONFIG.START_BET
var curPosition = null // betBull
var betted = false // betted to next round?
var curEpoch, openPrice, closeTime

//Bet UP
const betUp = async (amount, epoch) => {
    try {
        const tx = await predictionContract.betBull(epoch, {
            value: parseEther(amount.toFixed(18).toString()),
        })
        await tx.wait()
        console.log(`🤞 Successful bet of ${amount} BNB to UP 🍀`)
    } catch (error) {
        console.log("Transaction Error", error)
    }
}

//Bet DOWN
const betDown = async (amount, epoch) => {
    try {
        const tx = await predictionContract.betBear(epoch, {
            value: parseEther(amount.toFixed(18).toString()),
        })
        await tx.wait()
        console.log(`🤞 Successful bet of ${amount} BNB to DOWN 🍁`)
    } catch (error) {
        console.log("Transaction Error", error)
    }
}


//Percentage difference
const percentage = (a, b) => {
    return parseInt(100 * a / (a + b))
}

//Strategy of betting
const bet = async (betAmount, epoch) => {
    
    if (curPosition==='up') {
        console.log(`${epoch.toString()} 🔮 Prediction: UP 🟢 ${betAmount}`)
        await betUp(betAmount, epoch)
    } else if (curPosition==='down') {
        console.log(`${epoch.toString()} 🔮 Prediction: DOWN 🔴 ${betAmount}`)
        await betDown(betAmount, epoch)
    }
}
//Check balance
getBNBPrice().then(price=>console.log('bnb/usd', price))

const main = async()=>{    
    if(await checkBalance(GLOBAL_CONFIG.START_BET)){
        curEpoch =  await predictionContract.currentEpoch()
        curEpoch = Number(curEpoch)-1
        console.log('current epoch', curEpoch)
        let round = await getRoundData(curEpoch)
        console.log('round', round[0])
        closeTime = round[0].closeTimestamp
        openPrice = Number(round[0].openPrice)
        console.log('🤗 Welcome! Waiting for next round...')
        setInterval(start, 1000)    
    } 
}

const start = async()=>{
    let curTime = Math.round(Date.now()/1000)
    let curPrice = await getBNBPrice()

    // almost time to end current round
    if(closeTime - curTime < GLOBAL_CONFIG.TIME_TO_NEXT && !betted){
        if(curPrice < openPrice){            
            if(curPosition==null || curPosition==='down'){
                curBet = GLOBAL_CONFIG.INIT_BET                
            }else{
                curBet *= 2
            }            
            curPosition = 'down'
        }else{
            if(curPosition==null || curPosition==='up'){
                curBet = GLOBAL_CONFIG.INIT_BET                
            }else{
                curBet *= 2
            }   
            curPosition = 'up'
        }

        betted = true        
        await bet(curBet, curEpoch+1)
        curEpoch++
    }else if(betted){
        let round = await getRoundData(curEpoch)
        if(Number(round[0].openPrice)  > 0){
            openPrice = Number(round[0].openPrice)
            closeTime = round[0].closeTimestamp
            // console.log(`${round} openPrice: ${openPrice}`)
            betted = false
        }
    }
}

main()