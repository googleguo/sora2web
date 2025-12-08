"use client"

import type React from "react"
import NextLink from "next/link"
import { useParams } from "next/navigation"
import type { Locale } from "./config"

interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  href: string
}

export function Link({ href, ...props }: LinkProps) {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"

  const localizedHref = href.startsWith(`/${locale}`) ? href : `/${locale}${href}`

  return <NextLink href={localizedHref} {...props} />
}

export default Link
