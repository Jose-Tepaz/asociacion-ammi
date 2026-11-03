import type { Metadata } from 'next/types'

import { notFound } from 'next/navigation'
import React from 'react'

import { getPostCategories, PostsListing } from '@/components/PostsListing'
import PageClient from '../../page.client'
import { getCategoryBySlug } from './getCategory'

export const revalidate = 600

type Args = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Args) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  return (
    <>
      <PageClient />
      <PostsListing category={category} />
    </>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  return { title: `${category?.title || 'Publicaciones'} · AMMI` }
}

export async function generateStaticParams() {
  const categories = await getPostCategories()
  return categories.map(({ category }) => ({ slug: category.slug }))
}
