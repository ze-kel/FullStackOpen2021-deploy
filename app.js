const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const chokidar = require('chokidar')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const path = require('path')

logger.info('connecting to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        logger.info('connected to db')
    })
    .catch((e) => {
        logger.error('error connecting to db', e)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.get('/health', (req, res) => {
    res.send('ok')
})

app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

const watcher = chokidar.watch('server') // Watch server folder
watcher.on('ready', () => {
    watcher.on('all', () => {
        Object.keys(require.cache).forEach((id) => {
            if (id.includes('server')) delete require.cache[id] // Delete all require caches that point to server folder (*)
        })
    })
})

if (
    !process.env.NODE_ENV === 'production' ||
    !process.env.NODE_ENV === 'test'
) {
    console.log('Starting hot reload mode')
    const webpack = require('webpack')
    const middleware = require('webpack-dev-middleware')
    const hotMiddleWare = require('webpack-hot-middleware')
    const webpackConf = require('./webpack.config')
    const compiler = webpack(
        webpackConf('development', { mode: 'development' })
    )

    const devMiddleware = middleware(compiler)
    app.use(devMiddleware)
    app.use(hotMiddleWare(compiler))
    app.use('*', (req, res, next) => {
        const filename = path.join(compiler.outputPath, 'index.html')
        console.log(filename)
        console.log('universal get')
        devMiddleware.waitUntilValid(() => {
            compiler.outputFileSystem.readFile(filename, (err, result) => {
                if (err) return next(err)
                res.set('content-type', 'text/html')
                res.send(result)
                return res.end()
            })
        })
    })
} else {
    console.log('Starting static mode')
    const DIST_PATH = path.resolve(__dirname, './dist')
    const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

    app.use('/', express.static(DIST_PATH))
    app.use('/blogs', express.static(DIST_PATH))
    app.use('/users', express.static(DIST_PATH))
    app.get('*', (req, res) => {
        console.log(req.url)
        console.log('universal get')
        res.sendFile(INDEX_PATH)
    })
}

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
