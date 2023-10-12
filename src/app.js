import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import { __dirname } from './utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './managers/ProductManager.js'

const app = express()
const port = 8080

//app.use función que agrega un nuevo middleware a la aplicación
app.use(express.json())//Analiza las solicitudes JSON entrantes y coloca los datos analizados en formato req.body
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))//Indicamos que deseamos que public se vuelva estatico. En la ruta raiz se mostrará el index.html

// Especifico el motor de plantillas que voy a utilizar - handlebras
app.engine("handlebars", engine()); //primer parametro es el motor de plantilla y el segundo todo lo que hace ese motor de plantilla
//configuraciones de express para motores de plantilla
app.set("views", __dirname + "/views");//configuracion para indicar ubicaciones de las vistas del motor de plantilla
app.set("view engine", "handlebars");//configuracion del motor de plantilla que voy a utilizar

//app.use función que en estos casos agrega los routers que va a utilizar y sus rutas para acceder a los mismos
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/views',viewsRouter)//este router solo se va a encargar de todos los reenderizados

const httpServer = app.listen(port,(error)=>{
    if(error) console.log(error)
    console.log("Servidor escuchando en el puerto: ", port)
}) //Solo el server http

const socketServer = new Server(httpServer)//socketServer será un servidor para trabajar con sockets

const prodManager = new ProductManager('./src/data/products.json')

socketServer.on("connection", async (socket) => {

    const products = await prodManager.getProducts()

    socketServer.emit("products", products);

    socket.on("CreateProduct", async (value) => {
        await prodManager.addProducts(value)
    });
    socket.on("deleteId", async (value) => {
        await prodManager.deleteProduct(value)
    });
  });