# 🔮🚀 pancakeswap prediction bot v1.0

The bot that uses martingale system.

## 🐰⚡ Installation

Download and Install Node here:
https://nodejs.org/en/download/

Then run the following commands in terminal:

``git clone https://github.com/smart92dev/PancakePredictionBot.git`` 


## ⚙️ Setup

1. Open the **.env** file with any code/text editor and add your private key like so:
```
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```
3. Open the **bot.js** file and setup the following variables:
```
INIT_BET: 0.005,    // initial bet amount after winning (In BNB)
START_BET: 0.005,   // bet amount when starting bot (In BNB)
TIME_TO_NEXT: 5,    // betting time before starting next round (seconds)
```
4. Start the bot using `yarn start`. If this doesn't work, please run  `npm start`.
5. 🔮 Enjoy!

### 🔓 How to convert seed phrase to Private Key
A lot of wallets don't provide you the private key, but just the **seed phrase** ( 12 words ). So here you will learn how to convert that to a private key:
1. Enter [Here](https://youtu.be/eAXdLEZFbiw) and follow the instructions. Website used is [this one](https://iancoleman.io/bip39/).


## 🤖📈 Strategy
This bot uses famouos Martingale betting system. If lose, bet 2x of past amount, If win, bet initial amount
This does not mean blindly betting up or down. For example, if you keep betting only on up, the amount of bets increases tremendously because you don't know when it will go up in a situation where the bnb price continues to fall. So this bot bets on the next round as the result of the current round. In other words, if the current round ends on down, you bet on down assuming that there is a high probability of a down in the next round. In my experience, the number of up and down swaps never exceeded 10 at most. It was a worthwhile experience. So I decided to implement this as a bot.


💰You can check the history of rounds and claim rewards here: https://pancakeswap.finance/prediction

## 📢 Initial Bet and total balance to run bot
Make a minimum INIT_BET of 0.005bnb to get a minimal profit. There are many cases where the winning payout of the game is 2 or less, and gas fees are incurred when betting. If the round continues up or down, the profit margin is higher. On the other hand, if up and down are alternated repeatedly, profit will be lower. So 0.005bnb is suitable if you want to see a statistically minimal profit margin. Of course, this is up to you. If you set the initial bet amount to 0.005, it is safe to start the bot with a generous 5 bnb. Of course, this is also up to you. I'm just empirically suggesting the most reasonable option.

START_BET is the amount to bet when starting the bot. If you win, you will bet INIT_BET in the next round.

## 🚧 Result
Red underlined items are winning rounds, others are losing rounds.
![bot screenshot](/image/test.png?raw=true)

## 👁️ Tips
Of course, this bot's strategy isn't all-around, and it's not without risk.
    
Rather than running the bot all day, it was more advantageous to run the bot for 2-3 hours by increasing the initial bet amount by taking the time when the current bnb price fluctuates greatly.

## 🎯 Goal
In the future, I will continue to upgrade the bot to become more intelligent, stable and the best by adding the ability to automatically turn the bot on and off by predicting times when the bnb price fluctuates significantly.

If you have a better idea, share it and move forward.

wishing you luck

## ⭐IF you are good, please give a **star** to this bot.

Contact us. 📩 emeralddev92@gmail.com