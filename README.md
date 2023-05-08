# cmdBay
Documentation:


Description:

![image](https://user-images.githubusercontent.com/72666124/236924161-46629629-ae3f-4cee-b6b0-3286da58d172.png)

cmdBay is a store accessed by a command interface. It offers plethora of functions for interaction with the store


![image](https://user-images.githubusercontent.com/72666124/236924344-e77fbfa4-da27-4a42-b034-65c66403c907.png)

Uses json-server as a mini database - https://www.npmjs.com/package/json-server

Uses axios to make api calls to the json server - https://axios-http.com/docs/intro

Uses https for HTTP protocol over TLS/SSL - https://nodejs.org/api/https.html

Uses readline for interface - https://nodejs.org/api/readline.html


Instructions:

In one node in cmdBay directory run: json-server --watch db.json

In src directory run: node index.js

Firstly: sign up with: cb signUp <username> <password>
  
Secondly: authenticate with:  cb auth <username> <password>
  
Lastly: Enjoy the app.

  
  
Commands:
  
list - list all items - usage: cb list
  
auth - authenticates the user - usage: cb auth <username> <password>
  
addById - adds object by its id - usage: cb addById <id>
  
buy - sends the order and takes the money - usage: cb buy
  
signUp - adds the user to the system - usage: cb signUp <username> <password>
  
addBallance - adds value to the balance - usage: cb addBallance <amount>
  
cart - logs the contents of the cart - usage: cb cart
  
userData - logs the user data - usage: cb userData
  
logOut - logs the user out of the system - usage: cb logOut
  
ballance - logs your ballance - usage: cb ballance
  
search - searches the item by its name - usage: cb search <part_of_the_name>
  
addByName - adds item to the cart by its name - usage: cb addByName <part_of_the_name>
  
removeItem - removes the item from the cart - usage: cb removeItem <index_of_item_in_array>

