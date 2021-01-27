const express = require("express");
const server = express();
const cors = require("cors");
server.use(cors());
const body_parser = require("body-parser");

server.use(body_parser.json());

const port = 4000;
const axios = require('axios');
// << db setup >>
const db = require("./db");
const { response } = require("express");
const dbName = "MyDB";
const collectionName_users = "users";

const collectionName_customers = "customers"

const collectionName_projects = "project"

const collectionName_invoices = "invoices"

db.initialize(dbName, collectionName_users, function (dbCollection) { // successCallback
    // get all items
    server.get("/users", (request, response) => {

        dbCollection.find().toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            response.json(result);
        });
    });

    server.get("/users/:email", (request, response) => {
        const emailID = request.params.email;

        dbCollection.findOne({ email: emailID }, (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log(result)
            response.json(result);
        });
    });

    server.get("/users/:email/projects", (request, response) => {
        const emailID = request.params.email;
        var userId;
        dbCollection.findOne({ email: emailID }, (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            }
            userId = result.id;

            var new_list = []
            axios.get('http://localhost:4000/projects')
                .then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        // console.log(response[i].status)
                        if (response.data[i].userId === userId) {
                            new_list.push(response.data[i])
                        }
                    }
                })
                .catch(error => {
                    // console.log(error);
                });
            response.json(new_list);
        });
    });

}, function (err) { // failureCallback
    throw (err);
});


// ----------------------------------- Customer APIS ---------------------------------------

db.initialize(dbName, collectionName_customers, function (dbCollection) { // successCallback
    // get all items
    server.get("/customers", (request, response) => {

        dbCollection.find().toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            response.json(result);
        });
    });


    // << db CRUD routes >>
    server.get("/customers/:slug", (request, response) => {
        const slug = request.params.slug;

        dbCollection.findOne({ slug: slug }, (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log(result)
            response.json(result);
        });
    });

    // server.get("/customers/:slug/projects", (request, response) => {
    //     const slug = request.params.email;

    //     dbCollection.findOne({ slug: slug }, (error, result) => {
    //         if (error){
    //             console.log(error);
    //             throw error;
    //         } 
    //         console.log(result)
    //         response.json(result);
    //     });
    // });

    // server.get("/customers/:slug/invoices", (request, response) => {
    //     const slug = request.params.email;

    //     dbCollection.findOne({ slug: slug }, (error, result) => {
    //         if (error){
    //             console.log(error);
    //             throw error;
    //         } 
    //         console.log(result)
    //         response.json(result);
    //     });
    // });

}, function (err) { // failureCallback
    throw (err);
});

// ----------------------------------- Projects APIS -----------------------------------------

db.initialize(dbName, collectionName_projects, function (dbCollection) { // successCallback
    // get all items
    server.get("/projects", (request, response) => {

        dbCollection.find().toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            response.json(result);
        });
    });


    // << db CRUD routes >>
    server.get("/projects/status/:status", (request, response) => {
        const projectStatus = request.params.status;

        dbCollection.find().toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            // response.json(result);

            var new_list = []
            for (var i = 0; i < result.length; i++) {
                console.log(result[i].status)
                if (result[i].status === projectStatus) {
                    new_list.push(result[i])
                }
            }
            response.json(new_list);
        });
    });

}, function (err) { // failureCallback
    throw (err);
});


// ------------------------------------------- Invoices APIS ------------------------------------


db.initialize(dbName, collectionName_invoices, function (dbCollection) { // successCallback
    // get all items
    server.get("/invoices", (request, response) => {

        dbCollection.find().toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            response.json(result);
        });
    });


    // << db CRUD routes >>
    server.get("/invoices/status/:status", (request, response) => {
        const projectStatus = request.params.status;

        dbCollection.find().toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            // response.json(result);

            var new_list = []
            for (var i = 0; i < result.length; i++) {
                console.log(result[i].status)
                if (result[i].status === projectStatus) {
                    new_list.push(result[i])
                }
            }
            response.json(new_list);
        });
    });

}, function (err) { // failureCallback
    throw (err);
});


function call_myFunction(id) {
    var result1;
    console.log("userid", id)
    db.initialize(dbName, collectionName_projects, function (dbCollection) { // successCallback
        // get all items
        dbCollection.findOne({ userId: id }, (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log("reulst", result)
            result1 = result;
        });
    });
    console.log(result1)
    return result1;
}


server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});


