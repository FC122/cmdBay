const readline = require('readline');
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_2_method' // or another supported version
});

const instance = axios.create({
    httpsAgent: agent
});

let user;
let url= "http://localhost:3000";

function auth(args){
    let endpoint = url + "/users?username="+args[1]+"&password="+args[2];
    instance.get(endpoint).then(response=>{
        user = response.data[0];
        if(user!=undefined){
            console.log("Authenticated as: \n"+ user.username)
        }else{
            console.log("Wrong password or username!")
        }
    }).catch(error => console.error(error));
}

function ballance(){
    if(user===undefined){
        console.log("Please Log In")
    }else{
        console.log(user.ballance)
    }
}

function userData(){
    if(user===undefined){
        console.log("Please Log In")
    }else{
        console.log(user)
    }
}

function cart(){
    instance.get(url+"/users/"+user.id).then(response=>{
        console.log(response.data.cart)
    })
}

function buy(){
    if(user===undefined){
        console.log("Please Log In")
    }else{
        instance.get(url+"/users/"+user.id).then(response=>{
            let user = response.data;
            let items = user.cart.items;
            let total=0;
            for(let i=0; i<items.length;i++){
                total +=items[i].price
            }
            let invoice={
                "user":user,
                "total":total,
                "id":Math.floor(Math.random() * Math.pow(2,32)) + 1
            };
            instance.post(url+"/invoices",{
                invoice
            })
            console.log(invoice)
            instance.patch(url+"/users/"+user.id,{
                cart:{items:[]}
            })
            instance.patch(url+"/users/"+user.id,{
                ballance:user.ballance-=total
            })
            instance.get(url+"/users/"+user.id).then(response=>{
                user=response.data
            })
        })
    }
}

function list(){
    let endpoint = "http://localhost:3000/items";
    console.log(endpoint)
    instance.get(endpoint)
    .then(response => {
        let items = response.data
        for(let j=0; j < items.length;j++){
            console.log("\tItem: " + items[j].name)
            console.log("\tDescription: " + items[j].description)
            console.log("\tSupply: " + items[j].supply)
            console.log("\tPrice: " + items[j].price)
            console.log("\tId: " + items[j].id + "\n")
        }
    }).catch(error => console.error(error));
}

function addById(id){
    if(user===undefined){
            console.log("Please Log In")
    }else{
        //console.log("http://localhost:3000/users/"+user.id)
        let endpoint = "http://localhost:3000/items/" + id
        instance.get(endpoint).then(response=>{
            let item = response.data
            instance.get("http://localhost:3000/users/"+user.id).then(response=>{
                response.data.cart.items.push(item)
                //console.log(response.data.cart.items.push(item))
                instance.patch("http://localhost:3000/users/"+user.id,{
                    cart:response.data.cart
                }).then(response=>{
                    console.log("Cart: "+JSON.stringify(response.data.cart.items))
                    instance.patch("http://localhost:3000/items/"+id,{
                        supply:item.supply-1
                    })
                })
            })
        })
        instance.get(url+"/users/"+user.id).then(response=>{
            user=response.data
        })
    }
}

function signUp(args){
    let newUser={
        "username": args[1],
        "password": args[2],
        "id": Math.floor(Math.random() * Math.pow(2,32)) + 1,
        "ballance": args[3],
        "cart": {
          "items": [
          ]
        }
    }
    instance.post(url+"/users",newUser)
}

function addBallance(args){
    instance.patch(url+"/users/"+user.id,{
        ballance:user.ballance + args[1]
    })
    instance.get(url+"/users/"+user.id).then(response=>{
        user=response.data
    })
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function logOut(){
    user=undefined;
}

function help(){
    console.log("list - list all items - usage: cb list")
    console.log("auth - authenticates the user - usage: cb auth <username> <password>")
    console.log("addById - adds object by its id - usage: cb addById <id>")
    console.log("buy - sends the order and takes the money - usage: cb buy")
    console.log("signUp - adds the user to the system - usage: cb signUp <username> <password>")
    console.log("addBallance - adds value to the balance - usage: cb addBallance <amount>")
    console.log("cart - logs the contents of the cart - usage: cb cart")
    console.log("userData - logs the user data - usage: cb userData")
    console.log("logOut - logs the user out of the system - usage: cb logOut")
    console.log("ballance - logs your ballance - usage: cb ballance")
    console.log("search - searches the item by its name - usage: cb search <part_of_the_name>")
    console.log("addByName - adds item to the cart by its name - usage: cb addByName <part_of_the_name>")
    console.log("removeItem - removes the item from the cart - usage: cb removeItem <index_of_item_in_array>") 
}

function search(args){
    instance.get(url+"/items?q="+args[1]).then(response=>{
        console.log(response.data)
    })
}

function addByName(args){
    if(user===undefined){
        console.log("Please Log In")
    }else{
        instance.get(url+"/items?q="+args[1]).then(response=>{
            id=response.data[0].id;
            //console.log("http://localhost:3000/users/"+user.id)
            let endpoint = "http://localhost:3000/items/" + id
            instance.get(endpoint).then(response=>{
                let item = response.data
                instance.get("http://localhost:3000/users/"+user.id).then(response=>{
                    response.data.cart.items.push(item)
                    //console.log(response.data.cart.items.push(item))
                    instance.patch("http://localhost:3000/users/"+user.id,{
                        cart:response.data.cart
                    }).then(response=>{
                        console.log("Cart: "+response.data.cart)
                        instance.patch("http://localhost:3000/items/"+id,{
                            supply:item.supply-1
                        })
                    })
                })
            })
        })
        instance.get(url+"/users/"+user.id).then(response=>{
            user=response.data
        })
    }
}
function removeItem(args){
    instance.get(url + "/users/"+user.id).then(response=>{
        let cart=response.data.cart;
        cart.items.splice(args[1],1);
        instance.patch(url+"/users/"+user.id,{
            cart:cart
        })
    })
    instance.get(url + "/users/"+user.id).then(response=>{
        user=response.data
    })
}
function main(){
    rl.on('line', (line) => {
        const split = line.split(' '); 
        const command = split[1];
        const args = split.slice(1);
       
        switch (command) {
            case 'list':
                list();
                break;
            case 'auth':
                auth(args);
                break;
            case 'addById':
                addById(args[1]);
                break;
            case 'buy':
                buy();
                break;
            case 'signUp':
                signUp(args);
                break;
            case 'addBallance':
                addBallance(args);
                break; 
            case 'cart':
                cart();
                break; 
            case 'userData':
                userData();
                break; 
            case 'logOut':
                logOut();
                break; 
            case 'ballance':
                ballance(args);
                break; 
            case 'search':
                search(args);
                break; 
            case 'addByName':
                addByName(args);
                break; 
            case 'removeItem':
                removeItem(args);
                break; 
            case 'help':
                help();
                break; 
            default:
                console.log(`Unknown command: ${command}`);
        }
        
        rl.prompt();
    }).on('close', () => {
        console.log('Exit');
        process.exit(0);
    })
}

main()