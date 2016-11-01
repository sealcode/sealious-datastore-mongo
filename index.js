"use strict";
var Promise = require("bluebird");
var MongoClient = require('mongodb').MongoClient;
var DbsCommonPart = require('sealious-datastore-dbs-common-part');

module.exports = function(App){
	const priv = {db: null};

	var DatastoreMongo  = App.createDatastore({name:"mongo"});

	DatastoreMongo.start = function(){
		var self = this;
		var config = App.ConfigManager.get_config().datastore_mongo;

		var url = `mongodb://${config.host}:${config.port}/${config.db_name}`;
		return Promise.promisify(MongoClient.connect)(url)
			.then(function(db){
				if (db === null){
					return Promise.reject("MongoDB was not found, please make sure it's installed. Check https://docs.mongodb.org/manual/tutorial/ for more info.");
				} else {
					priv.db = db;
					return self.post_start();
				}
			});
	};

	DbsCommonPart(App, DatastoreMongo, priv);
};
