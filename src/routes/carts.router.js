import { Router } from "express";
import { CartManager } from '../managers/CartManager.js'
import { ProductManager } from '../managers/ProductManager.js'

const router = Router();

const cartManager = new CartManager('./src/data/carts.json')
const prodManager = new ProductManager('./src/data/products.json')

router.post('/', async (req,res) => {
    try{
        await cartManager.createCart()
        res.status(200).json({ message: "Carrito creado" })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

router.get('/:cid', async (req,res) => {
    const cid = req.params.cid
    try{
        const products = await cartManager.getProductsByCart(cid)
        res.status(200).json({ message: "Productos asociados al id de carrito indicado", products })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

router.post('/:cid/product/:pid', async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        const carts = await cartManager.getCarts()
        const cart = carts.find(item => item.idCart == cid)
        const prod = await prodManager.getProductByID(pid)
        if(!prod){
            res.status(404).json({ message: "No existe el producto con el id indicado" })
        }else{
            if(!cart){
                res.status(404).json({ message: "No existe el carrido con el id indicado" })
            }else{
                await cartManager.addProductToCart(cid,pid)
                res.status(200).json({ message: "Agregado el producto al carrito" })
            }
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})


export default router;