'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export const createInvoice = async (formData: FormData) => {
  const { amount, customerId, status } = CreateInvoice.parse({
    amount: formData.get('amount'),
    customerId: formData.get('customerId'),
    status: formData.get('status')
  })

  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export const updateInvoice = async (id: string, formData: FormData) => {
  const { amount, customerId, status } = UpdateInvoice.parse({
    amount: formData.get('amount'),
    customerId: formData.get('customerId'),
    status: formData.get('status')
  })

  const amountInCents = amount * 100

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `

  revalidatePath('/dashboard/invoices')
  revalidatePath(`/dashboard/invoices/${id}/edit`)
  redirect('/dashboard/invoices')
}

export const deleteInvoice = async (id: string) => {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
