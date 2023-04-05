const blog = require('../models/blog')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(function(sum, blog) {
        return sum + blog.likes
    }, 0)
}


module.exports = {
    dummy,
    totalLikes
}