import ProductManager from "./ProductManager.js";
let productManager = new ProductManager();
console.log(productManager);

let persistirProduct = async () => {
    await productManager.createProduct("Producto2","Soy una Descripcion", 5,"link-url", "codigo", 1500 )
    let products = await productManager.productList();
    let productIdToDelete = 0; //id a elimminar
    productManager.deleteProductById(productIdToDelete);
    let productId = 1689248274367; // id buscada    
    productManager.getProductById(productId);
    let productIdToUpdate = 0; //id buscado para modificar
    const fieldToUpdate = 'price';  // campo a actualizar
    const updatedValue = 14.99; // valor a actualiza
    productManager.updateProduct(productIdToUpdate, fieldToUpdate, updatedValue);

    console.log(`Productos encontrados en Products Manager : ${products.length}`);
    console.log(products);
};


persistirProduct();
