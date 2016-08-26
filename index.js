var Promise = require("bluebird");
var Sealious = require("sealious");
var MongoClient = require('mongodb').MongoClient;
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
	return Promise.promisify(MongoClient.connect)(url)
	.then(function(db){
		if (db === null){
			return Promise.reject("MongoDB was not found, please make sure it's installed. Check https://docs.mongodb.org/manual/tutorial/ for more info.");
		} else {
			private.db = db;
			return self.post_start();
		}
	});
};


DatastoreMongo = DbsCommonPart(DatastoreMongo,private);		

module.exports = DatastoreMongo;
