var app = require('express')(); // Express App include
var http = require('http').Server(app); // http server
var bodyParser = require("body-parser"); // Body parser for fetch posted data
Eos = require('eosjs');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var port = 8080;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

user1wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";user1wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";
user2wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";
user3wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";
user4wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";
user5wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";

pubkey = "EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn";

eos = Eos({ keyProvider: "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi", chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", httpEndpoint: "http://localhost:8888" });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// **********************************************
// ***************** LOGIC **********************
// **********************************************


pushAction = (caller, contractName, functionName, params) => {
	eos = Eos({ keyProvider: wif, chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", httpEndpoint: "http://dev.cryptolions.io:18888" });
	
	eos.transaction({
    actions: [
    {
        account: contractName,
        name: functionName,
        authorization: [
        {
            actor: params.account,
            permission: "active"
        }
        ],
        data: {
        _serial: params.registrationId,
        _sku: params.title,
        _latlon: params.value,
        _imagehash: params.address,
		_imagehash: params.description,
        }
    }
    ]
	}).then((res)=> {
		return({result:res,error:null});
	}).catch((err)=> {
		return({result:null,error:err});
	});
}

transferTokens = (caller, contractName, params) => {
	eos = Eos({ keyProvider: wif, chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", httpEndpoint: "http://dev.cryptolions.io:18888" });
	eos.transaction({
    actions: [
    {
        account: contractName,
        name: "transfer",
        authorization: [
        {
            actor: caller,
            permission: "active"
        }
        ],
        data: {
        from: params,
        to: params,
        quantity: params,
        memo: params
        }
    }
    ]
    }).then((res) => {
		return({result:res,error:null});
	}).catch((err)=> {
		return({result:null,error:err});
	});
}

getBalance = (contractName, caller) => {
	eos = Eos({ keyProvider: wif, chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", httpEndpoint: "http://dev.cryptolions.io:18888" });
	eos.getTableRows({
	  code:contractName,
      scope:caller,
      table:'accounts',
      json: true,
	})
    .then((result) => {
		console.log(result);
	});
}

getTableRows = (contractName, table, caller) => {
	eos = Eos({ keyProvider: wif, chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", httpEndpoint: "http://dev.cryptolions.io:18888" });
	eos.getTableRows({
	  code:contractName,
      scope:contractName,
      table:'accounts',
      json: true,
	})
    }).then((res) => {
		return({result:res,error:null});
	}).catch((err)=> {
		return({result:null,error:err});
	});
}

updateAuth = (accountName, contractName, accountAuth, pubkey) => {
	eos = Eos({ keyProvider: wif, chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", httpEndpoint: "http://dev.cryptolions.io:18888" });
	eos.updateauth({
        "account": accountName,
        "permission": accountAuth,
        "parent": "",
        "auth": {
          "keys": [{
            "key": pubKey,
            "weight": 1
          }],
          "threshold": 1,
          "accounts": [{
            "permission": {
              "actor": contractName,
              "permission": "eosio.code"
            },
            "weight": 1
          }],
          "waits": []
        }
      }).then((res)=>{
        console.log('res', res);
        return res;
      }).
      catch((err)=>{
        console.log(err);
        alert(err);
        this.setState({
          error: err
        })
      });
    };






// **********************************************
// ***************** API'S **********************
// **********************************************

app.post('/api/accounts/:accounts/registrations', function(req, res) {
	console.log("testing");
	console.log(req.body);
	res.status(200).send({txnHash:"0xgagsa876a876s8a76"});
	/*
	var params = {from:,to:,caller:,memo:"memo"}
	var resultTransfer = transferTokens(req.params.accounts, contractName, params);
	var resultPush = pushAction(req.params.accounts, registrynft, issue, req.body);	
	if(result != null){
		//res.status(200).send(result.result);
		res.status(200).send({txnHash:"0xgagsa876a876s8a76"});
	}
	else{
		//res.status(500).send(result.error);
		res.status(500).send({result:"FAILURE"});
	}*/
});


app.get('/api/accounts/:accounts/registrations', function(req, res) {
	console.log("testing");
	console.log(req.body);
	res.status(200).send([{nftId:"NFT1",registrationId:"RG123",title:"2bhk",value:"50000 USD",tokenize:false},{nftId:"NFT2",registrationId:"RG456",title:"5bhk",value:"90000 USD",tokenize:true}]);
	/*
	var result = getTableRows(contractName, table, caller);	
	if(result != null){
		//res.status(200).send(result.result);
		res.status(200).send([{id:"NFT1",title:"2bhk",value:"50000 USD"}]);
	}
	else{
		//res.status(500).send(result.error);
		res.status(500).send({result:"FAILURE"});
	}*/
});

app.post('/api/accounts/:account/issuetokens', function(req, res) {
	var resultPushCreate = await pushAction(reotAdmin, reotToken, create, req.body);	
	var resultPushIssue = await pushAction(reotAdmin, reotToken, issue, req.body);
	var resultPushAction = await pushAction(reotAdmin, registrynft, tokenissued, req.body);
});


app.get('/api/gettablerows', function(req, res) {
	res.send('test');
});


app.get('/api/updateauth', function(req, res) {
});


app.get('/api/accounts/:accounts/balance', function(req, res) {
	var resultBal = await getBalance(contractName, request.params.accounts);
    if(resultBal.result != null){
		res.status(200).send(resultBal.result);
	}
	else{
		res.status(500).send(resultBal.error);
	}
});

app.listen(port,function(){
  console.log("Started on PORT ",port);
})

