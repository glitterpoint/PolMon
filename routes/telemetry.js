/**
 * Created by Surya on 11/2/2016.
 */
var express = require('express');
var router = express.Router();
var sql     = require('mssql');


var config = {
   server: 'gpcsql1.database.windows.net',
   database:'AirPolluMonitorDb',
   user: 'Surya',
   password: 'gniK21gnik',
   options:{encrypt:true}
};

router.get('/', function(req, res, next){
   console.log('---') ;
   res.send('Telemetry...')

});
router.get('/device/:deviceId', function(req, res, next){
  // res.send(req.params.deviceId)

   sql.connect(config, function(err){
      if(err) console.log(err);

      var request = new sql.Request();
      var sqlQuery = "select * from telemetry where DeviceId=@deviceId";

      request
          .input('deviceId',  sql.UniqueIdentifier,   req.params.deviceId)
          .query(sqlQuery,function(err, recordset){
             if(err) console.log(err);
             res.json(recordset);
          });
   });

});


router.post('/', function(req, res, next){

   sql.connect(config, function(err){
      if(err) console.log(err);

      var request = new sql.Request();
      var sqlQuery = "insert into Telemetry(DeviceId, Name, Value, SensorTypeId, EventTypeId, CreatedOn)" +
                     "values(@devId, @name, @value, @sensId, @eventId, GetDate())";


      request
          .input('devId',     sql.UniqueIdentifier,   req.body.devId)
          .input('name',      sql.NVarChar,   req.body.name)
          .input('value',     sql.Int,        req.body.value)
          .input('sensId',    sql.Int,        req.body.sensId)
          .input('eventId',   sql.Int,        req.body.eventId)
          .query(sqlQuery,function(err, recordset){
             if(err) console.log(err);
             res.send('Telemetry Posted');
             res.json(recordset);
          });
   });
   // res.send('POST RECEIVED...' + req.body[0].DeviceId);
});


// export the module...
module.exports = router;