const requireUser = (req, res, next) => {
    if(req) {
        console.log(`User ${req} is logged in`)
    }
}

module.exports = {requireUser};