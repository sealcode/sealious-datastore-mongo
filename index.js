var Promise = require("bluebird");
var Sealious = require("sealious");
var mongodb = require("mongodb");

var db = null;

var datastore_mongo = new Sealious.ChipTypes.Datastore("mongo");

Sealious.ConfigManager.set_default_config(
	"datastore_mongo", 
	{
		embedded: false,
		host: 'localhost',
		port: 27017,
		db_name: 'sealious'
	}
);

var DatastoreMongo = new function(){
	this.start = function(){
		var config = Sealious.ConfigManager.get_config("datastore_mongo");
		var mongo_client = new mongodb.MongoClient(new mongodb.Server(config.host, config.port));
		return new Promise(function(resolve, reject){
			mongo_client.open(function(err, mongoClient){
				db = mongoClient.db(config.db_name);
				resolve();
			});
		});	
	}
}

module.exports = DatastoreMongo;



