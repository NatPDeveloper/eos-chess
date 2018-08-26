class Scatter {
    
    constructor() {
        this.CHAIN_PROTOCOL = 'http';
        this.CHAIN_HOST = '127.0.0.1'; //'mainnet.eoscalgary.io' //'nodes.get-scatter.com' //'br.eosrio.io'
        this.CHAIN_PORT = '8888' //8080' //80
        // const CHAIN_ADDRESS = CHAIN_PROTOCOL + '://' + CHAIN_HOST + ':' + CHAIN_PORT;
        this.CHAIN_ID = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f';
        
        /* Eos and Scatter Setup */
        this.network = {
            protocol: this.CHAIN_PROTOCOL,
            blockchain: 'eos',
            host: this.CHAIN_HOST,
            port: this.CHAIN_PORT,
            chainId: this.CHAIN_ID,
            broadcast: true,
            sign: true
        }

        document.addEventListener('scatterLoaded', function() {
            this.scatter = window.scatter
            window.scatter = null

            document.getElementById("scatterLogout").addEventListener('click', function() {
                this.scatter.forgetIdentity().catch(error => {
                    alert(error)
                });
                alert("logged out of scatter");
            }.bind(this))
        
            document.getElementById("scatterLogin").addEventListener('click', function(event) {
                
                let getIdentity = () => {
                    this.scatter.getIdentity({accounts:[this.network]}).then(identity => {
                        console.log(identity, "identitySuccess")
                    }).catch(error => {
                        console.log(error, "identityCrisis")
                    })
                }
                getIdentity()
            }.bind(this));

        }.bind(this))
    }

    _setMove(roomId, move){
        var eos = this.scatter.eos( this.network, Eos )
        var account = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
        var options = { authorization: [{ actor:account.name, permission: account.authority }] };
        
        eos.contract('eosio').then(contract => {
            contract.setmove(account.name, roomId, move, options)
        }).catch(e => {
            console.log("error", e);
        })
    }
    
    // FUNCTIONS
    setMove(roomId, move) {
        return this._setMove(roomId, move);
    }
}