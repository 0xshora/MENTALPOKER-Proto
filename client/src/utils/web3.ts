import Web3 from 'web3';

let web3: Web3 | undefined;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
      console.log('MetaMask is locked or the user has not connected any accounts');
    } else {
      console.log('MetaMask is unlocked and the user has connected their account:', accounts[0]);
    }
  });
} else {
  console.error('MetaMaskがインストールされていません。');
}

export default web3;
