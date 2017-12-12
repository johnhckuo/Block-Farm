<p align=center>
<img src="https://i.imgur.com/vDXmtSV.png">
</p>
<p align=center>
<a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
<a target="_blank" href="http://makeapullrequest.com" title="PRs Welcome"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a target="_blank" href="https://gitter.im/Block-Farm/Support" title="Gitter chat"><img src="https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg"></a>
</p> 

# Block Farm   

A farming game built upon Ethereum platform.

## Getting Started

### Prerequisites

#### 1. TestRPC
```
npm install -g ethereumjs-testrpc 
```

#### 2. Truffle
```
npm install -g truffle 
```

#### 3. Meteor
```
curl https://install.meteor.com/ | sh
```

## Running the DApp

First, you need get your own ethereum client node. And the easiest way to do this is either installing light-weight ethereum wallet or using testrpc. In our case, we use testrpc by typing the following command in to your terminal/command line:
```
testrpc
```
Now, you need to deploy the smart contracts to the local private chain you just set up. We've already wrote a script to get all the trivial things done. For Mac/Linux users, just go to the `Block-Farm` directory and execute the script by typing:
```
sh truffle/Compile.sh
```
For Windows users, please type:
```
truffle/Compile.bat
```
It should take a while for truffle to deploy all the contracts to testrpc. Once it is done, There should be all the address of each contract shown on the console, just copy them and update the default contract address in `app/client/lib/contract.js`.

After finishing all these steps, change your current path to the `app` folder and execute:
```
meteor npm install
```
Then type the following command to start buliding our app
```
meteor
```
Congratulations! Now just type `localhost:3000` in your web browser and you are good to go!

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/johnhckuo/a08fc77a28d2addd0082a8bf54178421) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
