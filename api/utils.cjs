const requireUser = (req, res, next) => {
    if(req) {
        console.log(req.name)
    }
}

module.exports = {requireUser};