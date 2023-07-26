import { log } from "console";
import fs from "fs";

class Product {
    constructor(title,description,price,thumbnail,code,stock){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code 
        this.stock = stock
}};

export default class ProductManager{
    products;
    productsDirPath;
    productsFilePath;
    fileSystem;
    static generateId() {
        return Date.now();
    }

    constructor(){
        this.products = new Array();
        this.productsDirPath = "./files";
        this.productsFilePath = this.productsDirPath + "/Products.json";
        this.fileSystem = fs;
        
    }
    
    createProduct = async(title,description,price,thumbnail,code,stock) => {
        let newProduct = new Product(title,description,price,thumbnail,code,stock)
        newProduct.id = ProductManager.generateId();
        console.log("Crar Producto : producto registrado");
        console.log(newProduct);
        try {
            await this.fileSystem.promises.mkdir(this.productsDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.productsFilePath)){
                await this.fileSystem.promises.writeFile(this.productsFilePath, "[]");
            }
        let productFile = await this.fileSystem.promises.readFile(this.productsFilePath,"utf-8")
        console.info("Archivo Json obtenido desde el archivo: ");
        console.log(productFile)
        this.products = JSON.parse(productFile)
        console.log("Productos encontrados : ");
        console.log(this.products);
        this.products.push(newProduct)
        await this.fileSystem.promises.writeFile(this.productsFilePath, JSON.stringify(this.products, null, 2 , '\t'));
        } catch(error) { 
            console.error(`Error creando producto nuevo : ${JSON.stringify(newProduct)},
            detalle del error : ${error}`);
            throw Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)},
            detalle del error : ${error}`);
        }
}
    getProductById = async (productId) => {
        try {
            const products = await this.productList();
            const product = products.find(product => product.id === productId);
            if (product) {
            console.log(`Producto encontrado con ID ${productId}:`);
            console.log(product);
                return product;
        }   else {
            console.log(`Producto no encontrado con ID ${productId}.`);
                return null;
        }
    }   catch(error) {
            console.error(`Error al buscar el producto con ID ${productId}: ${error}`);
            throw Error(`Error al buscar el producto con ID ${productId}: ${error}`);
    }
}
    productList = async () => {
        try {
            await this.fileSystem.promises.mkdir(this.productsDirPath, { recursive : true });
            if (!this.fileSystem.existsSync(this.productsFilePath)) { 
                await this.fileSystem.promises.writeFile(this.productsFilePath , "[]");
            }
            let productFile = await this.fileSystem.promises.readFile(this.productsFilePath , "utf-8")
            console.info("Archivo JSON obtenido desde archivo:")   
            console.log(productFile)
            this.products = JSON.parse(productFile);
            console.log("Productos Encontrados : ");
            console.log(this.products);
            return this.products
        } catch(error) { 
            console.error(`Error consultando lista de productos, vilide el archivo : ${this.productsDirPath},
            detalle del error : ${error}`);
            throw Error(`Error Consultando por lista de productos, valide el archivo: ${this.productsDirPath},
            detalle del error : ${error}`);
        }
    }
    deleteProductById = async (productId) => {
        try {
            const products = await this.productList();
            const updatedProducts = products.filter(product => product.id !== productId);
            await this.fileSystem.promises.writeFile(this.productsFilePath, JSON.stringify(updatedProducts, null, 2, '\t'));
            console.log(`Producto con ID ${productId} eliminado correctamente.`);
        } catch(error) {
            console.error(`Error al eliminar el producto con ID ${productId}: ${error}`);
            throw Error(`Error al eliminar el producto con ID ${productId}: ${error}`);
        }
    }
    updateProduct = async (productId, fieldToUpdate, updatedValue) => {
    try {
        const products = await this.productList();
        const productToUpdate = products.find(product => product.id === productId);
        if (productToUpdate) {
            productToUpdate[fieldToUpdate] = updatedValue;
            await this.fileSystem.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, 2, '\t'));
            console.log(`Producto con ID ${productId} actualizado correctamente.`);
            console.log(`Nuevo valor para el campo ${fieldToUpdate}: ${updatedValue}`);
        } else {
            console.log(`Producto no encontrado con ID ${productId}.`);
        }
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${productId}: ${error}`);
        throw Error(`Error al actualizar el producto con ID ${productId}: ${error}`);
    }
}} 
