const http = require('http')


const server = http.createServer((req,res)=>{
    // // console.log(req.method)
    // console.log(req.url)
    // res.end("Welcome to ToDo App Server")

    if (req.url === '/post' ) {
        res.end("This is post method")
    } else {
        res.end("Welcome to ToDo App server")
    }
})

server.listen(5000, "127.0.0.1",()=>{
    console.log('Server is listning on port 5000')
})