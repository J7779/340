

const intentionalErrorController = {};

intentionalErrorController.causeError = async function(req, res, next) {
    console.log("Causing an error...");
    let aNumber = 1/0;
    throw new Error("This is an intentional error.");
  
    res.render("./", {
        title: "Intentional Error",
    })
}

module.exports = intentionalErrorController;