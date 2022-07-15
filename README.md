
  

#  ✨ nlogin-webjs

[nLogin](https://www.nickuc.com/pt/details/nlogin) plugin integrated with your project!

Note: This is a fork of([original package](https://www.npmjs.com/package/nlogin)) but more updated with some improvements and password hashing added...


###  🎇 Include library

You need to do the import, you can do it like this:
```js
const  nLogin  =  require('nlogin')
```
###
Now we need to create a new instance for the database to connect to.

  

```js
const  nloginInstance  =  new  nLogin("host without port", "dbusername", "dbpassword", "dbname",  (err)=>{
	console.log(err  ==  null?  "Connected!"  :  "Error connecting!")
	...
})
```
##  Available Methods 🔍

  

### 👦 User Authentication:
```js
nloginInstance.checkPassword("username","password",  (isCorrectPass)=>{
	console.log(isCorrectPass?"Access granted!":"Access denied!")

	...
})
```
### 🎫 Register a Player:
```js
nloginInstance.register("username","password","email","ip",  null/*this is the callback but is optional, it just tells if it was successful*/)

```

### ✅ Check If Player Is Registered:
```js
nloginInstance.isUserRegistered("username",  (isRegistered)=>{
	console.log(isRegistered?"Registered":"Not registered")
	...
})
```
###  ✅ Check if a IP Is Registered:
```js
nloginInstance.isIpRegistered("ad.dr.es.s",  (isRegistered)=>{
	console.log(isRegistered?"Registered":"Not registered")
	...
})
```
### 🔏 Change a Player's Password:
```js
nloginInstance.changePassword("newPassword",  "XtiagodinisX", callback /*Optional*/)
```
#
<span style="color:red">Note: The code will be refactored and organized as I see fit, so that little by little the project becomes independent and no longer a fork.</span>
