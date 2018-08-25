function Scatter(){
    
    const CHAIN_PROTOCOL = 'http';
    const CHAIN_HOST = '127.0.0.1'; //'mainnet.eoscalgary.io' //'nodes.get-scatter.com' //'br.eosrio.io'
    const CHAIN_PORT = '8888' //8080' //80
    const CHAIN_ADDRESS = CHAIN_PROTOCOL + '://' + CHAIN_HOST + ':' + CHAIN_PORT;
    const CHAIN_ID = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f';
    /* Eos and Scatter Setup */
    const network = {
        protocol: CHAIN_PROTOCOL,
        blockchain: 'eos',
        host: CHAIN_HOST,
        port: CHAIN_PORT,
        chainId: CHAIN_ID,
        broadcast: true,
        sign: true
    }
    
    // scatter.connect("ChessEOS").then(connected => { gives weird error:
    // scatter.min.js:30645 GET http://127.0.0.1:50005/socket.io/?EIO=3&transport=polling&t=MLhtaCX 0 ()

    function appTransaction(data){
        // console.log(scatter.identity)
        // eos = scatter.eos( network, Eos )
        account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
        options = { authorization: [{ actor:account.name, permission: account.authority }] };
        
        eos.contract('eosio').then(contract => {
            contract.getmoves(account.name, options)
        }).catch(e => {
            console.log("error", e);
        })
    }
    
    document.addEventListener('scatterLoaded', () => {
        const scatter = window.scatter
        const eos = scatter.eos( network, Eos )
        const account = scatter.identity.accounts.find(account => account.blockchain === 'eos')
        const options = { authorization: [{ actor:account.name, permission: account.authority }] };
        console.log("SHOULD BE NULLLLLLLLLLLLLLLLLLLLLLL" + scatter)
        
        let getIdentity = () => {
            scatter.getIdentity({accounts:[network]}).then(identity => {
                console.log(identity, "identitySuccess")
            }).catch(error => {
                console.log(error, "identityCrisis")
            })
        }

        document.getElementById("scatterLogout").addEventListener('click', function() {
            scatter.forgetIdentity().catch(error => {
                alert(error)
            });
            alert("logged out of scatter");
        })
    
        document.getElementById("scatterLogin").addEventListener('click', function() {
            getIdentity()
        });
    
        document.getElementById("scatterTest").addEventListener('click', function() { 
            // eos = scatter.eos( network, Eos )
            eos.contract('eosio').then(contract => {
                contract.getmoves(account.name, options)
            })
        })
        window.scatter = null
    })
    
    console.log("how many times is this running?")

    return {
        addPlayer:function(player){
            return appTransaction("addplayer");
        }, getPlayer:function(){
            return appTransaction("getplayer");
        }, update:function(player, newPlayerName){
            return appTransaction("update");
        }, setMove:function(move){
            return appTransaction(move);
        }, getMoves:function(){
            return appTransaction("getmoves");
        }
    }
}