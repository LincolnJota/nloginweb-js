var mysql = require('mysql');
var algorithms = require('./algorithm')
const TABLE_NAME = 'nlogin'
class nLogin {

  constructor(host, username, password, database, callback) {
    this.bcrypt = new algorithms.BCrypt();
    this.sha256 = new algorithms.SHA256();
    this.sha512 = new algorithms.SHA512();
    this.authme = new algorithms.AuthMe();
    this.def_algo = this.bcrypt;
    this.con = mysql.createConnection({
      host: host,
      password: password,
      user: username,
      database: database
    })
    this.con.connect((err) => {
      callback(err)
    })
  }

  /**
   * Retrieves the hash associated with the given user from the database.
   *
   * @param {string} username the username whose hash should be retrieved
   * @return {string|null} the hash, or null if unavailable (e.g. username doesn't exist)
   */
  getHashedPassword(username, callback) {
    username = username.trim();
    this.con.query(`select password from nlogin where name = '${username.toLowerCase()}' limit 1`, (err, result, fields) => {
      if (err) throw err;
      callback(result[0] ? result[0].password : "")
    })
  }
  checkPassword(username, password, callback) {
    this.getHashedPassword(username, (hash) => {
      if (hash) {
        try {

          var algorithm = this.detectAlgorithm(hash);
          var isValid = algorithm.isValid(password, hash);
          callback(isValid)
        } catch (error) {
          console.log('Aconteceu um erro! ' + error.message);
          callback(false);
        }
      } else {
        callback(false)
      }
    });
  }

  /**
   * Retorna o algoritmo usado na senha.
   *
   * @param {string} hashed_pass Senha criptografada.
   * @return {any} Retorna o algoritmo usado. Se for desconhecido ou não suportado, retorna null.
   */
  detectAlgorithm(hashed_pass) {
    var algo = (hashed_pass.includes("$") ? hashed_pass.split("$")[1] : '').toUpperCase();
    switch (algo) {
      case '2':
      case '2A':
        return this.bcrypt;

      case "PBKDF2":
        // will be added
        throw new Error("PBKDF2 is not supported yet");

      case "ARGON2I":
        // will be added
        throw new Error("ARGON2I is not supported yet");

      case "SHA256":
        return this.sha256;

      case "SHA512":
        return this.sha512;

      case "SHA":
        return this.authme;

      default:
        throw new Error("Unknown algorithm");
    }
  }
  hash(passwd) {
    return this.def_algo.hash(passwd);
  }
  destruct() {
    this.con.destroy()
    this.con = null;
  }
  getEmail(username, callback) {

    username = username.trim();
    this.con.query(`select email from nlogin where name = '${username.toLowerCase()}' limit 1`, (err, result, fields) => {
      if (err) throw err;
      callback(result[0] ? result[0].email : null)
    })
  }
  setEmail(username, email, callback = null) { 
    username = username.trim()
    this.con.query(`UPDATE nlogin SET email = '${email}' WHERE name = '${username.toLowerCase()}'`, (err, result, fields) => {
      if (callback) callback(err == null)
    })
  }
  setIp(username, ip, callback = null) {
    username = username.trim()
    this.con.query(`UPDATE nlogin SET address = '${ip}' WHERE name = '${username.toLowerCase()}'`, (err, result, fields) => {
      if (callback) callback(err == null)
    })
  }
  getIp(username, callback) {

    username = username.trim();
    this.con.query(`select address from nlogin where name = '${username.toLowerCase()}' limit 1`, (err, result, fields) => {
      if (err) throw err;
      callback(result[0] ? result[0].ip : null)
    })
  }
  isUserRegistered(username, callback) {
    username = username.trim();
    this.con.query(`SELECT 1 FROM ${TABLE_NAME} WHERE name = '${username.toLowerCase()}' LIMIT 1`, (err, result, fields) => {
      if (err) throw err

      callback(result.length > 0)
    });

  }
  isIpRegistered(address, callback) {
    this.con.query('SELECT 1 FROM ' + TABLE_NAME + ' WHERE address = "' + address + '" LIMIT 1', (err, result, fields) => {

      callback(result.length > 0)

    });


  }
  /**
   * Changes password for player.
   *
   * @param {string} username the username
   * @param {string} password the password
   * @return {bool} true whether or not password change was successful 
   */
  changePassword(passwd, username, callback = null) {
    username = username.trim()
    var hash = this.hash(passwd)
    this.con.query(`UPDATE nlogin SET password = '${hash}' WHERE name = '${username.toLowerCase()}'`, (err, result, fields) => {
      if (callback) callback(err == null)
    })

  }
  getInfo(username, callback) {

    username = username.trim();
    this.con.query(`select * from nlogin where name = '${username.toLowerCase()}' limit 1`, (err, result, fields) => {
      if (err) throw err;
      callback(result[0]);
    })
  }
  register(username, password, email, ip, callback = null) {
    var username = username.trim()
    var email = email ? email : ""
    var hash = this.hash(password)
    var usernameLowerCase = username.toLowerCase()
    if (this.isUserRegistered(username)) {
      this.con.query(`update ${TABLE_NAME} set email = '${email}',address='${ip}',password='${hash}' where name = '${usernameLowerCase}'`, (err, result, fields) => {
        if (callback != null) {
          callback(false, err == null)
        }
      })

    } else {
      this.con.query(`insert into ${TABLE_NAME} (name,realname,address,password, email) values ('${usernameLowerCase}', '${username}', '${address}','${password}','${email}')`, (err, result, fields) => {
        if (callback != null) {
          callback(true, err == null)
        }
      })
    }
  }
}
module.exports = nLogin
