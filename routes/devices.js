/**
 * Created by Surya on 10/31/2016.
 */
var express = require('express');
var router  = express.Router();
var sql     = require('mssql');


var config = {
    server: 'gpcsql1.database.windows.net',
    database:'AirPolluMonitorDb',
    user: 'Surya',
    password: 'gniK21gnik',
    options:{encrypt:true}
};


/* GET users listing. */
router.get('/', function(req, res, next) {

    sql.connect(config, function(err){
        if(err) console.log(err);
        console.log('connected to db...');

        var request = new sql.Request();
        request.query('select * from device', function(err, recordset){
           if(err) console.log(err);
            res.json(recordset);
            console.log(JSON.stringify(recordset));
        });
    });
});


router.post('/', function(req, res, next){

    sql.connect(config, function(err){
        if(err) console.log(err);

        var request = new sql.Request();
        var sqlQuery = "insert into device(Name, description, location, softwareversion, createdOn, modifiedOn, softwareupdatedon)" +
            "values(@name, @desc, geography::Point(@long, @lat, 4326), @version,GetDate(), GetDate(), GetDate())";


        request
            .input('name',      sql.NVarChar,   req.body.Name)
            .input('desc',      sql.NVarChar,   req.body.Description)
            .input('long',      sql.Int,        req.body.Location.Long)
            .input('lat',       sql.Int,        req.body.Location.Lat)
            .input('version',   sql.Int,        req.body.Version)
            .query(sqlQuery,function(err, recordset){
                        if(err) console.log(err);
                        res.send('Device registered');
                        res.json(recordset);
                         console.log(JSON.stringify(recordset));
                });
    });
   // res.send('POST RECEIVED...' + req.body[0].DeviceId);
});

module.exports = router;
