'use client'

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
// import { Component, useEffect, useState } from 'react'

interface Link {
  name: string
  href: string
  icon: any
  className?: string
}

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links: Link[] = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

// const useLinks = (links: Link[]) => {
//   const pathname = usePathname()
//   const [_links, _setLinks] = useState(links)

//   useEffect(() => {
//     _links.forEach((link, i) => {
//       if (pathname === link.href) {
//         _links[i].className = 'current bg-sky-100 text-blue-600'
//         _setLinks(_links)
//       } else {
//         _links[i].className = ''
//       }
//     })
//   }, [pathname])

//   return _links
// }

export default () => {
  const pathname = usePathname()
  // const _links = useLinks(links)

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              'bg-sky-100 text-blue-600': pathname === link.href,
            })}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
