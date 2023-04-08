const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {  
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[3])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[4])
    await blogObject.save()
})


test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('all blog are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('adding blog', async () => {
    const newBlog = new Blog(helper.extraBlog)
    await newBlog.save()
    
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContainEqual('TDD harms architecture')
})

test('delete 1 blog', async () => {
  const blogsAtStart = helper.initialBlogs
  const blogToDelete = blogsAtStart[2]

  await api
  .delete(`/api/blogs/${blogToDelete._id}`)
  .expect(204)

  const blogsAtEnd = await helper.blogsInDB()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).not.toContainEqual(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})