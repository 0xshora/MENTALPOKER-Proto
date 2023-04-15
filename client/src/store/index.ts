import Vue from 'vue';
import Vuex from 'vuex';
import Web3 from 'web3';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: null,
    web3: null,
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setWeb3(state, web3) {
      state.web3 = web3;
    },
  },
  actions: {
    async connectMetaMask({ commit }) {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          commit('setAccount', accounts[0]);
          commit('setWeb3', web3);

          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              commit('setAccount', null);
              console.log('MetaMask is locked or the user has not connected any accounts');
            } else {
              commit('setAccount', accounts[0]);
              console.log('MetaMask is unlocked and the user has connected their account:', accounts[0]);
            }
          });
        } catch (error) {
          console.error('MetaMaskへの接続に失敗しました。', error);
        }
      } else {
        console.error('MetaMaskがインストールされていません。');
      }
    },
  },
  modules: {},
});
