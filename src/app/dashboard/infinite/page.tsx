'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import React from 'react'
import { Spinner } from '@nextui-org/spinner'
import { Image } from '@nextui-org/image'

interface IMovie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vota_average: number
}

interface IMovieResponse {
  page: number
  results: IMovie[]
  total_pages: number
}

const fetchMovies = async ({ pageParam = 1 }): Promise<IMovieResponse> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_MOVIES_BASE_URL}/movie/popular`,
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_MOVIES_API_KEY,
        page: pageParam,
      },
    },
  )
  return response.data
}

export default function InfiniteMovies() {
  const {
    data: listMovies,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1
      }
      return undefined
    },
  })

  const movies = listMovies?.pages.flatMap((page) => page.results) ?? []

  if (isLoading) {
    return (
      <section className="flex-1">
        <Spinner size="lg" color="danger"></Spinner>
      </section>
    )
  }

  if (isError) {
    ;<section className="flex-1 text-danger">
      Erro na chamada da API do MOVIEDB
    </section>
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Filmes Populares</h1>
      <InfiniteScroll
        dataLength={movies.length}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        loader={<Spinner size="md" color="danger"></Spinner>}
        endMessage={<h4> Não a mais filmes para carregar</h4>}
      >
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <section
              key={movie.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col justify-center items-center p-4"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover"
              ></Image>
              <h2 className="text-xl font-semibold mb-2 trucante text-zinc-600">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-700 line-clamp-3">
                {movie.overview}
              </p>
            </section>
          ))}
        </section>
      </InfiniteScroll>
    </section>
  )
}
