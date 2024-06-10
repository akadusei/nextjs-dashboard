import Form from '@/app/ui/invoices/edit-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data'

export default async function Page({ params }) {
  const id = params.id

  const breadcrumbs = [
    { label: 'Invoices', href: '/dashboard/invoices' },
    {
      label: 'Edit Invoice',
      href: `/dashboard/invoices/${id}/edit`,
      active: true,
    },
  ]

  const [ customers, invoice ] = await Promise.all([
    fetchCustomers(),
    fetchInvoiceById(id)
  ])

  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
