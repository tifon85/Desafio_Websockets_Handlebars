import { Router } from "express"
import { ProductManager } from '../managers/ProductManager.js'

const router = Router()

const prodManager = new ProductManager('./src/data/products.json')

router.get('/products', async (req,res) => {
    const products = await prodManager.getProducts()
    console.log(products)
    res.render("home", { products })
})

router.get('/realtimeproducts', async (req,res) => {
    res.render("realtimeproducts")
})

export default router