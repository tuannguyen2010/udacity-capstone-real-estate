const proofJson = require("../../zokrates/zokrates/code/proof.json");

App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },
    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initContract();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initContract: function () {
        /// Source the truffle compiled smart contracts
        var jsonSolnSquareVerifier='../eth-contracts/build/contracts/SolnSquareVerifier.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSolnSquareVerifier, function(data) {
            console.log('data',data);
            var SolnSquareVerifierArtifact = data;
            App.contracts.SolnSquareVerifierContract = TruffleContract(jsonSolnSquareVerifier);
            App.contracts.SolnSquareVerifierContract.setProvider(App.web3Provider);
            
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case "add":
                return await App.add(event);
                break;
            case "mint":
                return await App.mint(event);
                break;
            }
    },

    add: function(event) {
        console.log(proofJson);
        event.preventDefault();
        App.contracts.SolnSquareVerifierContract.deployed().then(function(instance) {
        
        });
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});