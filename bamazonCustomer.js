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

    start();
})

function start() {

    connection.query("SELECT * FROM products", function(err, res) {
        // display the current product list
        console.log(res);

        // inintial inquirer prompt
        inquirer
            .prompt([
                // User prompt for item select
                {
                    name: "selectProduct",
                    type: "number",
                    message: "What is the ID of the product you are looking for?"
                },
                // User prompt for quantity
                {
                    name: "selectProductQuantity",
                    type: "number",
                    message: "How many of this product are you ordering?"
                }
            ])
            .then( function( answer ) {

                var dbSelectProduct;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === answer.selectProduct) {
                        dbSelectProduct = res[i];
                    }
                }

                // console.log(dbSelectProduct);
                console.log(dbSelectProduct)
                
                // Restart app if input is out of scope
                if( dbSelectProduct === undefined ) {
                    console.log("Inputs not valid");
                    
                    return start();
                }

                if( dbSelectProduct.stock_quantity < answer.selectProductQuantity ) {
                    console.log("Insufficient quantity!");

                    return start();
                }

                if( dbSelectProduct.stock_quantity >= answer.selectProductQuantity ) {

                    var updateProductStock = +dbSelectProduct.stock_quantity - +answer.selectProductQuantity;

                    console.log("update product stock ", updateProductStock);

                    var purchasePrice = answer.selectProductQuantity * dbSelectProduct.price;

                    console.log("product price ", purchasePrice)

                    // Query to update the DB.
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updateProductStock
                            },
                            {
                                item_id: answer.selectProduct
                            }
                        ],
                        function( err ) {
                            // Log error if one occurs when updating the DB
                            if( err ) {
                                throw err;
                            }

                            // Log that the DB was updated
                            console.log("Stock updated!");
                            console.log("You owe: $" + purchasePrice);
                            connection.end();
                        }
                    )
                }
            })
    })
}