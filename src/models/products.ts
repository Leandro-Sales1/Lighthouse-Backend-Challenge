
interface IProduct {
  SKU: string;
  name: string;
  price: number;
}

interface IProducts extends Array<IProduct> { }

export default IProducts;
