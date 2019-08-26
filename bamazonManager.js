var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",

    database: "bamazon"
})

connection.connect(function(err) {
    if (err) {
        throw err;
    }

    startManager();
})

function startManager() {

    inquirer
        .prompt([
            {
                name: "startOptions",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ]
            }
        ])
        .then( function( answer ) {

            switch( answer.startOptions ){
                
                case "View Products for Sale":

                    connection.query("SELECT * FROM products", function( err, res ) {

                        // Throws error if encountered
                        if( err ) throw err;

                        // Log the products table
                        console.log( res );

                        connection.end();
                    })

                    return

                case "View Low Inventory":

                    connection.query("SELECT * FROM products", function( err, res ) {

                        if( err ) throw err;

                        // Logs to a variable if the db entry has less than 5 stock
                        var dbLowInventory;
                        for( i = 0; i < res.length; i++ ) {

                            if( res[i].stock_quantity < 5 ) {

                                console.log(res[i]);

                            }
                        }
                    })

                    return

                case "Add to Inventory":

                    return

                case "Add New Product":

                    return

                default:

                    return
            }
        })
}

