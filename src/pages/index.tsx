import type { GetServerSideProps } from 'next'
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import Link from 'next/link';
import { Document } from 'prismic-javascript/types/documents';
import { client } from '@/lib/prismic';

import SEO from '@/components/SEO';

import { Title } from '@/styles/pages/Home'

interface IHomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: IHomeProps) {
  return (
    <div>
      <SEO
        title='DevCommerce, your best e-commerce!'
        image="boost.png"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results
    }
  }
}
