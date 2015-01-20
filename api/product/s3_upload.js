var express = require('express');

var AWS = require('aws-sdk');
var secrets = require('../../config/environment');

var s3 = new AWS.S3();
AWS.config.update({
        accessKeyId: secrets.aws.access,
        secretAccessKey: secrets.aws.secret
    });

//A sample route to receive
module.exports = function(req, res){
		console.log('test test')
    var s3 = new AWS.S3();
    var s3_params = {
    		//configure with your bucket name as a string
        Bucket: 'stackstore',
        Key: req.query.s3_object_name,
        Expires: 60,
        ContentType: req.query.s3_object_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err) return next(err);
        else{
        		//Everythings cool, return the public url to the form so you can put it in your db.
            var return_data = {
                signed_request: data,
                url: 'https://s3.amazonaws.com/stackstore/'+req.query.s3_object_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
};