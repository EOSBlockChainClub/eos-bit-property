var app = require('express')(); // Express App include
var http = require('http').Server(app); // http server
var bodyParser = require("body-parser"); // Body parser for fetch posted data
Eos = require('eosjs');
var events = require('events');
var eventEmitter = new events.EventEmitter();
const https = require('https');

var port = 8080;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var registrerwif = "5JH6P3wPnJ9CuYtCJDoHmzdZ7pDZgtbAWAgLEvX7QRqsZbrrx4D";user1wif = "5JhhMGNPsuU42XXjZ57FcDKvbb7KLrehN65tdTQFrH51uruZLHi";
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


async function pushAction(caller, contractName, functionName, data) {
	eos = Eos({ keyProvider: registrerwif, chainId:"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", httpEndpoint: "http://127.0.0.1:8888" });
	console.log(data);
	eos.transaction({
    actions: [
    {
        account: contractName,
        name: functionName,
        authorization: [
        {
            actor: "registrynft",
            permission: "active"
        }
        ],
        data: data
    }
    ]
	}).then((res)=> {
		console.log(res);
		return({result:res,error:null});
	}).catch((err)=> {
		console.log(err);
		return({result:null,error:err});
	});
}

async function transferTokens(caller, contractName, params) {
	console.log("tfr called")
	eos = Eos({ keyProvider: registrerwif, chainId:"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", httpEndpoint: "http://127.0.0.1:8888" });
	console.log(eos.transaction);
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
        from: caller,
        to: params.to,
        quantity: params.quantity,
        memo: params.memo
        }
    }
    ]
    }).then((res) => {
		console.log(res);
		return({result:res,error:null});
	}).catch((err)=> {
		console.log(err);
		return({result:null,error:err});
	});
}

getBalance = (contractName, caller) => {
	eos = Eos({ keyProvider: wif, chainId:"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", httpEndpoint: "http://dev.cryptolions.io:18888" });
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

async function getTableRows(contractName, table, caller) {
	eos = Eos({ keyProvider: wif, chainId:"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", httpEndpoint: "http://127.0.0.1:8888" });
	eos.getTableRows({
	  code:contractName,
      scope:contractName,
      table:'accounts',
      json: true,
    }).then((res) => {
		console.log(res);
		return({result:res,error:null});
	}).catch((err)=> {
		console.log(err);
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

app.post('/api/accounts/:accounts/registrations', async function(req, res) {
	console.log(req.params.accounts);
	console.log(req.body);
	var params = {from:req.params.accounts,to:"registrynft",quantity:"150.00 REUT",memo:"memo"}
	var data = {to:req.params.accounts,registrationId:req.body.registrationId,owner: req.params.accounts,value:req.body.value+" REUT",
	address:req.body.address,title:req.body.title,description:req.body.description,uris:["House"+req.body.registrationId]}
	var resultTransfer = await transferTokens(req.params.accounts, "reutadmin", params);
	var resultPush = await pushAction(req.params.accounts, "registrynft", "issue", data);	
	if(resultPush.result != null){
		//res.status(200).send(result.result);
		res.status(200).send(resultPush.result);
	}
	else{
		//res.status(500).send(result.error);
		res.status(500).send(resultPush.error);
	}
});


app.get('/api/accounts/:accounts/registrations', async function(req, res) {
	console.log("testing");
	console.log(req.body);
	//res.status(200).send([{nftId:"NFT1",registrationId:"RG123",title:"2bhk",address:"11th street NYC",value:"50000 USD",tokenize:false},{nftId:"NFT2",registrationId:"RG456",title:"5bhk",address:"Union square NYC",value:"90000 USD",tokenize:true}]);
	
	var result = await getTableRows(contractName, diamonds, req.params.accounts);	
	if(result != null){
		//res.status(200).send(result.result);
		res.status(200).send([{id:"NFT1",title:"2bhk",value:"50000 USD"}]);
	}
	else{
		//res.status(500).send(result.error);
		res.status(500).send({result:"FAILURE"});
	}
});

app.post('/api/accounts/:account/issuetokens', function(req, res) {
	var resultPushCreate =  pushAction(reotAdmin, reotToken, create, req.body);	
	var resultPushIssue =  pushAction(reotAdmin, reotToken, issue, req.body);
	var resultPushAction =  pushAction(reotAdmin, registrynft, tokenissued, req.body);
});


app.get('/api/news', function(req, resp) {
	var parsedData;
	https.get('https://newsapi.org/v2/everything?q=eosio&from=2018-10-11&sortBy=publishedAt&apiKey=d0d1bdaf72e74d80a7b9b18d7d01a90e'
, (res) => {
	
        let rawData = '';

		res.on('data', (chunk) => {
          rawData += chunk;
        });

        res.on('end', () => {
          try {
            parsedData = JSON.parse(rawData);
			resp.status(200).send(parsedData.articles);

          } catch (e) {
			  
          }
        });
      }).on('error', (e) => {
		  
      });

});


app.get('/api/updateauth', function(req, res) {
});


app.get('/api/accounts/:accounts/balance', function(req, res) {
	var resultBal =  getBalance(contractName, request.params.accounts);
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

