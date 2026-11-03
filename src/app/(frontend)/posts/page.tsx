import type { Metadata } from 'next/types'

import React from 'react'

import { PostsListing } from '@/components/PostsListing'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  return (
    <>
      <PageClient />
      <PostsListing />
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Publicaciones · AMMI`,
  }
}
