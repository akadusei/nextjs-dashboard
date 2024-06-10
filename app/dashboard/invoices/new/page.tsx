import Form from '@/app/ui/invoices/create-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'

export default async function Page() {
  const breadcrumbs = [
    { label: 'Invoices', href: '/dashboard/invoices' },
    {
      label: 'Create Invoice',
      href: '/dashboard/invoices/new',
      active: true,
    },
  ]

  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Form customers={customers} />
    </main>
  );
}
