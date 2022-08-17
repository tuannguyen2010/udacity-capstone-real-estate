App = {
    web3Provider: null,
    contracts: {},
    nftContract: null,
    proof: {},
    init: async function () {
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
            //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initContract();
    },

    getMetaskAccountID: async function () {
        web3 = new Web3(App.web3Provider);
        const networkId = await web3.eth.net.getId();
        console.log(networkId);

        
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

    initContract: async function () {
        /// Source the truffle compiled smart contracts
        const jsonSolnSquareVerifier = '../../eth-contracts/build/contracts/SolnSquareVerifier.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSolnSquareVerifier, function(data) {
            
            var SolnSquareVerifierArtifact = data;
            App.contracts.SolnSquareVerifierContract = TruffleContract(jsonSolnSquareVerifier);
            App.contracts.SolnSquareVerifierContract.setProvider(App.web3Provider);
            nftContract = new web3.eth.Contract(SolnSquareVerifierArtifact.abi, "0xe2817aD218311b6C936299dE286824627C7cc6e0");
            console.log(nftContract);
            App.fetchEvents();

        });

        const proofJson = '../../zokrates/zokrates/code/proof.json';
        $.getJSON(proofJson, function(data) {
            proof = data;
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
            case 1:
                return await App.add(event);
                break;
            case 2:
                return await App.mint(event);
                break;
            }
    },

    add: function(event) {
        console.log("Add solution");
        event.preventDefault();
        // App.contracts.SolnSquareVerifierContract.deployed().then(function(instance) {
      
        // });
        return nftContract.methods.add(
            proof.proof.a,
            proof.proof.b,
            proof.proof.c,
            proof.inputs
        ).send({ from: App.metamaskAccountID})
    },

    mint: function(event) {
        console.log("Mint NFT");
        const to = $("#to").val();
        const tokenId = $("#tokenId").val();

        return nftContract.methods.mint(
            to,
            tokenId,
            proof.inputs
        ).send({ from: App.metamaskAccountID})
    },

    fetchEvents: function () {
        if (typeof App.contracts.SolnSquareVerifierContract.currentProvider.sendAsync !== "function") {
            App.contracts.SolnSquareVerifierContract.currentProvider.sendAsync = function () {
                return App.contracts.SolnSquareVerifierContract.currentProvider.send.apply(
                App.contracts.SolnSquareVerifierContract.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SolnSquareVerifierContract.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});