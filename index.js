const SHA256 = require('crypto-js/sha256');

class Transaction{
  constructor(from, to, amount){
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

class Block{
  constructor(date, transactions, previousHash){
    this.previousHash = previousHash;
    this.date = date;
    this.transactions = transactions;
    this.hash = this.hashFunction();
    this.nonce = 0;
  }
  hashFunction(){
    return SHA256(this.previousHash + this.date + JSON.stringify(this.transactions) + this.nonce).toString();
  }
  mining(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.hashFunction();
    }
    console.log("Block Mined: " + this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesis()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.reward = 1000;
  }

  createGenesis(){
    return new Block("6/30/2022", "GENESIS BLOCK", "1");
  }
  
  lastBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(addressToBeRewarded){
    let block = new Block(Date.now(), this.pendingTransactions, this.lastBlock().hash);
    this.createTransaction(new Transaction(null, addressToBeRewarded, this.reward));
    block.mining(this.difficulty);
    
    console.log("Block Mined!");
    this.chain.push(block);
    
    this.pendingTransactions = [];
    
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  returnBalance(address){
    let balance = 0;
    
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.from === address){
          balance = balance - trans.amount;
        }
        if(trans.to === address){
          balance = balance + trans.amount;
        }
      }
    }
    return balance;
  }
  
  validateChain(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
      if(currentBlock.hash !== currentBlock.hashFunction()){
        return false;
      }
    }
    return true;
  }
}  
let Inferno = new Blockchain();
Inferno.createTransaction(new Transaction('address1', 'address2', 100));
Inferno.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
Inferno.minePendingTransactions('address3');

console.log('\nBalance of address3 is', Inferno.returnBalance('address3'));

console.log('\n Starting the miner again...');
Inferno.minePendingTransactions('address3');

console.log('\nBalance of address3 is', Inferno.returnBalance('address3'));

console.log(Inferno);