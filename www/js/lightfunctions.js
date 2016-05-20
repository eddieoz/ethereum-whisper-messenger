var web3 = new Web3();

var storage = window.localStorage;
//var global_keystore;
var global_keystore = JSON.parse(storage.getItem('stGlobal_keystore'));
console.log(global_keystore);

lightwallet.keystore.deriveKeyFromPassword(storage.getItem('stPassword'), function(err, pwDerivedKey) {
    var paddedSeed = lightwallet.keystore._decryptString(global_keystore.encSeed, pwDerivedKey);
    console.log(paddedSeed);
  //alert('Your seed is: "' + seed + '". Please write it down.')
  })

var addresses = global_keystore.ksData[global_keystore.defaultHdPathString].addresses;
console.log(addresses);

console.log('senderid: ' + storage.getItem('messageFromId'));



setWeb3Provider(global_keystore);
//networkinterface.getIPAddress(function (ip) { alert(ip); });

/*if (storage.getItem('stRandomSeed')){ 
  password = prompt('Enter password to retrieve your account', 'Password');
  lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey){
    global_keystore = new lightwallet.keystore(
      storage.getItem('stRandomSeed'),
      pwDerivedKey);
    global_keystore.generateNewAddress(pwDerivedKey, 2);
  })  
}
*/



/*if (storage.getItem('stGlobal_keystore') != ''){
  var global_keystore = JSON.parse(storage.getItem('stGlobal_keystore'))
}*/



var myIdentity;
var myIdPromise = web3.db.get('chat', 'identity').then(function (res) {  
    return shh.hasIdentity(res).then(function (has) {
        if (!has) {
            return shh.newIdentity().then(function (newId) {
                web3.db.put('chat', 'identity', newId);
                return newId;
            });
        }
        return res;
    });
}).then(function (id) {
    myIdentity = id;
    storage.setItem('messageFromId', myIdentity);
    return id;
}).catch(function (err) {
  console.log(err);
});




function setWeb3Provider(keystore) {
  var web3Provider = new HookedWeb3Provider({
    host: "http://31.33.7.14:8545",
    transaction_signer: keystore
  });

  web3.setProvider(web3Provider);
}

function newAddresses(password) {
  
  if (password == '') {
    password = prompt('Enter password to retrieve addresses', 'Password');
  }

  //var numAddr = parseInt(document.getElementById('numAddr').value);
  var numAddr = 1;

  lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

    global_keystore.generateNewAddress(pwDerivedKey, numAddr);
    console.log(global_keystore);

    var addresses = global_keystore.getAddresses();

    document.getElementById('sendFrom').innerHTML = ''
    document.getElementById('functionCaller').innerHTML = ''
    for (var i=0; i<addresses.length; ++i) {
      document.getElementById('sendFrom').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
      document.getElementById('functionCaller').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
    }    

    getBalances();
  })
}

function getBalances() {
  
  var addresses = global_keystore.getAddresses();
  document.getElementById('addr').innerHTML = 'Retrieving addresses...'

  async.map(addresses, web3.eth.getBalance, function(err, balances) {
    async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
      document.getElementById('addr').innerHTML = ''
      for (var i=0; i<addresses.length; ++i) {
        document.getElementById('addr').innerHTML += '<div>' + addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
      }
    })
  })

}

function setSeed() {
  var password = prompt('Enter Password to encrypt your seed', 'Password');

  lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

  global_keystore = new lightwallet.keystore(
    document.getElementById('seed').value, 
    pwDerivedKey);

  document.getElementById('seed').value = ''
  
  newAddresses(password);
  setWeb3Provider(global_keystore);
  
  getBalances();
  })
}

function newWallet() {
  //var extraEntropy = document.getElementById('userEntropy').value;
  console.log('Device UUID is: ' + device.uuid);
  console.log('Model is: ' + device.model);
  console.log('Platform: ' + device.platform);
  console.log('Version: ' + device.version);
  console.log('Manufacturer: ' + device.manufacturer);
  console.log('Serial: ' + device.serial);


  var extraEntropy = device.uuid + device.model + device.platform + device.version + device.manufacturer + device.serial;
  

  //document.getElementById('userEntropy').value = '';
  document.getElementById('newSeed').value = '';
  var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
  storage.setItem('stRandomSeed', randomSeed);
  document.getElementById('newSeed').innerHTML = storage.getItem('stRandomSeed');

  //var infoString = 'Your new wallet seed is: "' + randomSeed + 
  //  '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
  //  'Please enter a password to encrypt your seed while in the browser.'
  
  var infoString = 'Digite uma senha para criptografar suas palavras chave'
  var password = prompt(infoString, '');
  storage.setItem('stPassword', password);

  lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

    global_keystore = new lightwallet.keystore(
      randomSeed,
      pwDerivedKey);
  

    global_keystore.generateNewAddress(pwDerivedKey, 1);
    var addresses = global_keystore.getAddresses();

    //newAddresses(password); 

    document.getElementById('newSeed').innerHTML = randomSeed;
    for (var i=0; i<addresses.length; ++i) {
      document.getElementById('newWalletAddress').innerHTML += addresses[i] + ', ';
    }

    setWeb3Provider(global_keystore);
    //getBalances();
    storage.setItem('stGlobal_keystore', JSON.stringify(global_keystore));
    // WhisperID
    newWhisperID();

    })
}

function showSeed() {
  var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', '');
  //var password = storage.getItem('stPassword');

  lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
    var paddedSeed = lightwallet.keystore._decryptString(global_keystore.encSeed, pwDerivedKey);
    document.getElementById('showSeed2').innerHTML = paddedSeed;
    //console.log(paddedSeed);
    //alert('Your seed is: "' + seed + '". Please write it down.')
  })


  // Old Method
  /*lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
    var seed = global_keystore.getSeed(pwDerivedKey);
    document.getElementById('showSeed2').innerHTML = seed;
  //alert('Your seed is: "' + seed + '". Please write it down.')
  })*/
}

function sendEth() {
  var fromAddr = document.getElementById('sendFrom').value
  var toAddr = document.getElementById('sendTo').value
  var valueEth = document.getElementById('sendValueAmount').value
  var value = parseFloat(valueEth)*1.0e18
  var gasPrice = 50000000000
  var gas = 50000
  web3.eth.sendTransaction({from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas}, function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
  })
}

function functionCall() {
  var fromAddr = document.getElementById('functionCaller').value
  var contractAddr = document.getElementById('contractAddr').value
  var abi = JSON.parse(document.getElementById('contractAbi').value)
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = document.getElementById('functionName').value
  var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']')
  var valueEth = document.getElementById('sendValueAmount').value
  var value = parseFloat(valueEth)*1.0e18
  var gasPrice = 50000000000
  var gas = 3141592
  args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
  var callback = function(err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function showAddresses(){
  showSeed();

  //seed = storage.getItem('stRandomSeed');
  //document.getElementById('showSeed2').innerHTML = seed;

  var addresses = global_keystore.ksData[global_keystore.defaultHdPathString].addresses;
  console.log(addresses);
  //var addresses = global_keystore.getAddresses();
  document.getElementById('showAddress2').innerHTML = 'Retrieving addresses...'
  async.map(addresses, web3.eth.getBalance, function(err, balances) {
    async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
      document.getElementById('showAddress2').innerHTML = ''
      for (var i=0; i<addresses.length; ++i) {
        document.getElementById('showAddress2').innerHTML += addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ') <br />'
      }
    })
  })
  document.getElementById('showWhisperID2').innerHTML = storage.getItem('messageFromId');
}

function newWhisperID(){
  
  /*
  var identity = web3.shh.newIdentity();
  storage.setItem('messageFromId', identity);
  */

  var myIdentity;
  var myIdPromise = web3.db.get('chat', 'identity').then(function (res) {
      return shh.hasIdentity(res).then(function (has) {
          if (!has) {
              return shh.newIdentity().then(function (newId) {
                  web3.db.put('chat', 'identity', newId);
                  return newId;
              });
          }
          return res;
      });
  }).then(function (id) {
      myIdentity = id;
      storage.setItem('messageFromId', myIdentity);
      return id;
  }).catch(function (err) {
    console.log(err);
  });



}

function sendMessage(){
  var message = {
    from: storage.getItem('messageFromId'),
    to: document.getElementById('sendMessageTo').value,
    topics: web3.fromAscii('Mensagem'),
    payload: web3.fromAscii(document.getElementById('messagePayload').value),
    ttl: 100,
    priority: 100
  };
  console.log(message);
  web3.shh.post(message, function (err, result) {
    console.log(err, result);
  });
}