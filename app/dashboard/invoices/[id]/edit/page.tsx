import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const id = params.id;

  const breadcrumbs = [
    { label: 'Invoices', href: '/dashboard/invoices' },
    {
      label: 'Edit Invoice',
      href: `/dashboard/invoices/${id}/edit`,
      active: true,
    },
  ];

  const [customers, invoice] = await Promise.all([
    fetchCustomers(),
    fetchInvoiceById(id),
  ]);

  if (!invoice) notFound();

  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
