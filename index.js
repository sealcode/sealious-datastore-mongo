var Promise = require("bluebird");
var Sealious = require("sealious");
var MongoClient = require('mongodb').MongoClient
var assert = require("assert");
var DbsCommonPart = require('sealious-datastore-dbs-common-part');

var private = {db: null};

var DatastoreMongo  = new Sealious.ChipTypes.Datastore("mongo");

Sealious.ConfigManager.set_default_config(
	"datastore_mongo", 
	{
		embedded: false,
		host: 'localhost',
		port: 27017,
		db_name: 'sealious'
	}
);

DatastoreMongo.start = function(){
	var self = this;
	var config = Sealious.ConfigManager.get_config("datastore_mongo");

	var url = `mongodb://${config.host}:${config.port}/${config.db_name}`;
	return new Promise(function(resolve, reject){
		MongoClient.connect(url, function(err, db) {
			if (db === null){
				reject("MongoDB was not found, please make sure it's installed. Check https://docs.mongodb.org/manual/tutorial/ for more info.");
				return;
			} else {
				private.db = db;				
				self.post_start().then(function(){
					resolve();
				})
			}
		});		
	})


	var mongo_client = new Mongodb.MongoClient(new Mongodb.Server(config.host, config.port));
	return new Promise(function(resolve, reject){
		mongo_client.connect(function(err, mongoClient){
			if (mongoClient === null)
				reject("MongoDB was not found, please make sure it's installed. Check https://docs.mongodb.org/manual/tutorial/ for more info.");
			else {
				private.db = mongoClient.db(config.db_name);
				
			}
		});
	});	
}


DatastoreMongo = DbsCommonPart(DatastoreMongo,private);		

module.exports = DatastoreMongo;
