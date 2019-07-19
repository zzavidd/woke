
module.exports = {
  resToClient: (res, err, json) => {
    if (err && err !== true){
      console.error(err.toString());
      res.status(400).send({message: getErrMsg(err)});
    } else {
      json ? res.json(json) : res.status(200).send({ message: 'ok'});
    }
  },
}

getErrMsg = (err) => {
  if (err.errno === 1062){
    if (err.toString().includes("email")){ // If duplicate entry in MySQL
      return "This email address already exists.";
    } else if (err.toString().includes("username")){
      return "The username you have chosen already exists.";
    }
  }
  
  console.error(err);
  return err.toString(); 
}