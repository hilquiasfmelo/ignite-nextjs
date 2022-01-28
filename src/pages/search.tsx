import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from "prismic-javascript/types/documents";
import { GetServerSideProps } from "next";
import { client } from "@/lib/prismic";
import Link from "next/link";

interface SearchProps {
  searchResults: Document[]
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  function handleSearch(event: FormEvent) {
    event.preventDefault();

    router.push(`/search?query=${encodeURIComponent(search)}`);

    setSearch('');
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={event => setSearch(event.target.value)} />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map(searchResult => {
          return (
            <li key={searchResult.id}>
              <Link href={`/products/${searchResult.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(searchResult.data.title)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { query } = context.query;

  if (!query) {
    return {
      props: {
        searchResults: []
      }
    }
  };

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(query))
  ]);

  return {
    props: {
      searchResults: searchResults.results
    }
  }
}