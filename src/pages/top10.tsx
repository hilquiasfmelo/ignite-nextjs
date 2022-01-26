import { GetStaticProps } from "next";

interface IProducts {
  id: string;
  title: string;
}

interface IProductsProps {
  products: IProducts[];
}

export const getStaticProps: GetStaticProps<IProductsProps> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 5,
  }
}

export default function Top10({ products }: IProductsProps) {
  return (
    <div>
      <h1>Products</h1>

      <ul>
        {products.map(recommendedProduct => {
          return (
            <li key={recommendedProduct.id}>
              {recommendedProduct.title}
            </li>
          )
        })}
      </ul>
    </div>
  )
}