// create models for our specs, hold all the fields
// fields: types of fields, functions interacting with the database
const mongoose = require('mongoose');
const config = require('../config/database');
const request = require('request');

// Spec Schema
const RoleSchema = mongoose.Schema({
  // Attributes
  moduleName: {
    type: String
  },
  className: {
    type: String
  },
  liquid_class: {
    type: String
  },
  role: {
    type: String
  },
  reagent: {
    type: Boolean
  },
  id: {
    type: Number
  }
});

// We want to use it outside
// module.exports so that it can be used outside this file
const Role = module.exports = mongoose.model('Role', RoleSchema);

module.exports.getRoles = function (callback) {
  Role.find(callback);
}

module.exports.addRole = function (newRole, callback) {
  newRole.save(callback);
}

// module.exports.grabSpecsv1 = function (callback) {
//   request('http://10.253.7.14:8000/?request=getSpecs', function (error, response, body) {
//     if (response && response.statusCode == 200) {
//       var data = body;
//       var dataObj = JSON.parse(data);
//       for (var i = 0; i < dataObj.length; i++) {
//         // console.log('length' + i);
//         var grab = new Spec(dataObj[i]);
//         grab.save(callback);
//       }
//     }
//   })
// }

module.exports.grabRoles = function (callback) {
  request.post('http://10.253.7.14:8000', {
    json: {
      request: "fireplexCoreDaoRetrieval",
      coreDaoReqData: {
          attrName: "id",
          colNames: ["id"],
          coreDao: {
              id: "null",
              className: "Role",
              moduleName: "fireplex.data.backend.core"
          },
          dataRange: {},
          loadAll: "true"
      }
    }
  }, (error, response, body) => {
    if (response && response.statusCode == 200) {
      // console.log('body: ', body);
      // var strbody = JSON.stringify(body.results);
      var data = body.results;
      // console.log("data: ", data);
      // console.log('strbody: ', strbody);
      // var data = body;
      // var dataObj = JSON.parse(data);
      for (var i = 0; i < data.length; i++) {
        // console.log('length ' + i + ': ' + data[i]);
        var grab = new Role(data[i]);
        grab.save(callback);
        console.log(grab);
      }
    }
  })
}

module.exports.getByRole = function(role, callback) {
  const query = {role: role}
  Role.find(query, callback);
}

module.exports.getByLiquidClass = function(liquid_class, callback) {
  const query = {liquid_class: liquid_class}
  Role.find(query, callback);
}

module.exports.getById = function(id, callback) {
  const query = {id: id}
  Role.find(query, callback);
}

module.exports.getByConditions = function(role, liquid_class, callback) {
  const query = {
    role: role,
    liquid_class: liquid_class
  }
  Role.find(query, callback);
}