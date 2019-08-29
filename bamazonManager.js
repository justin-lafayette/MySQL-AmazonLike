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

                        connection.end();
                    })

                    return

                case "Add to Inventory":

                    connection.query("SELECT * FROM products", function( err, res ) {

                        inquirer
                            .prompt([
                                {
                                    name: "selectProduct",
                                    type: "number",
                                    message: "Which item do you want to add more of?"
                                },
                                {
                                    name: "updateProduct",
                                    type: "number",
                                    message: "How much do you want to add?"
                                }
                            ])
                            .then( function( answer ) {

                                var dbSelectProduct;
                                for (var i = 0; i < res.length; i++) {
                                    if (res[i].item_id === answer.selectProduct) {
                                        dbSelectProduct = res[i];

                                        // Calculate the updated item quantity
                                        var updateQuantity = +res[i].stock_quantity + +answer.updateProduct

                                        connection.query(
                                            "UPDATE products SET ? WHERE ?",
                                            [
                                                {
                                                    stock_quantity: updateQuantity
                                                },
                                                {
                                                    item_id: dbSelectProduct.item_id
                                                }
                                            ]
                                        )

                                        console.log("Item quantity has been updated to: " + updateQuantity);

                                        connection.end();
                                    }
                                }


                            })
                    })

                    return

                case "Add New Product":

                    connection.query("SELECT * FROM products", function( err, res ) {

                        inquirer
                            .prompt([
                                {
                                    name: "nameProduct",
                                    type: "input",
                                    message: "What is the name of the new product?"
                                },
                                {
                                    name: "departmentProduct",
                                    type: "input",
                                    message: "What is the department for this product?"
                                },
                                {
                                    name: "priceProduct",
                                    type: "number",
                                    message: "What is the price of this item?"
                                },
                                {
                                    name: "quantityProduct",
                                    type: "number",
                                    message: "How many of this item are available?"
                                }
                            ])
                            .then( function( answer ) {

                                // Create the new row in the SQL DB
                                connection.query(
                                    "INSERT INTO products SET ?",
                                    {
                                        product_name: answer.nameProduct,
                                        department_name: answer.departmentProduct,
                                        price: answer.priceProduct,
                                        stock_quantity: answer.quantityProduct
                                    },
                                    function( err ) {
                                        if( err ) throw err;

                                        console.log("Product successfully added!")

                                        connection.end();
                                    }
                                )
                            })
                    })

                    return

                default:

                    console.log("No valid response received.");
                    return
            }
        })
}

