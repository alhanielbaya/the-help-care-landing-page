import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: import.meta.env.SANITY_API_TOKEN,
})

export async function getPosts() {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage
    }`
  )
}

export async function getPost(slug: string) {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      body
    }`,
    { slug }
  )
}
