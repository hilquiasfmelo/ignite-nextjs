import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { client } from '@/lib/prismic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Document } from 'prismic-javascript/types/documents';


interface CategoryProps {
  category: Document;
  products: Document[];
}

type Params = {
  slug: string;
}

export default function Category({ products, category }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>
        {PrismicDOM.RichText.asText(category.data.title)}
      </h1>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/products/${product.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ])

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params as Params;

  const category = await client().getByUID('category', slug, {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  }
}

