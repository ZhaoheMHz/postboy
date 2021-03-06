import express from "express";
import DBHelper from './DBHelper';
import MongoDB from "mongodb";
const ObjectID = MongoDB.ObjectID;

let router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let uid = req.query.uid;
  let servicecode = req.query.servicecode;
  if(uid.trim() === '' || servicecode.trim() === '') {
    return res.send({
      resultCode:"10000",
      resultMessage:"uid不能为空或servicecode不能为空"
    });
  }
  try{
    let userconfig = await DBHelper.db.collection('userconfig').findOne({username:uid});
    let serviceConfig;
    if(userconfig.appVer === "1"){
      serviceConfig = userconfig.ServiceConfig.primary;
    }
    else {
      serviceConfig = userconfig.ServiceConfig.internation;
    }

    if(serviceConfig[servicecode] !== undefined && serviceConfig[servicecode].checked){
      let selectScenceID = serviceConfig[servicecode].selectScenceID || "default";
      if(selectScenceID === "default"){
        res.redirect('../service/response/'+servicecode);
      }
      else {
        let query = {
          '_id':ObjectID(serviceConfig[servicecode].selectScenceID),
        };
        let r = await DBHelper.db.collection('mockuser').findOne(query);
        return res.send(r.response);
      }
    }
    else {
      return res.send("");
    }
  }
  catch(e){
    console.log(e);
  }
  return res.send({errorcode:101});
});

export default router;


