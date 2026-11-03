import type { Metadata } from 'next/types'

import { notFound } from 'next/navigation'
import React from 'react'

import { PostsListing } from '@/components/PostsListing'
import PageClient from '../../../../page.client'
import { getCategoryBySlug } from '../../getCategory'

export const revalidate = 600

type Args = { params: Promise<{ slug: string; pageNumber: string }> }

export default async function Page({ params }: Args) {
  const { pageNumber, slug } = await params
  const page = Number(pageNumber)
  if (!Number.isInteger(page)) notFound()
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  return (
    <>
      <PageClient />
      <PostsListing category={category} page={page} />
    </>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { pageNumber, slug } = await params
  const category = await getCategoryBySlug(slug)
  return { title: `${category?.title || 'Publicaciones'}, página ${pageNumber} · AMMI` }
}
