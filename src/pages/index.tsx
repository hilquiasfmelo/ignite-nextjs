import type { GetServerSideProps } from 'next'
import { Title } from '@/styles/pages/Home'
import SEO from '@/components/SEO';

interface IProducts {
  id: string;
  title: string;
}

interface IHomeProps {
  recommendedProducts: IProducts[];
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const response = await fetch('http://localhost:3333/recommended');
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }
}

export default function Home({ recommendedProducts }: IHomeProps) {
  async function handleSum() {
    const { sum } = (await import('../lib/math')).default;

    alert(sum(3, 8));
  }

  return (
    <div>
      <SEO
        title='Dev Hilquias'
        image="boost.png"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            )
          })}
        </ul>
      </section>
      <button onClick={handleSum}>Sum!</button>
    </div>
  )
}
