'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer' }),
  amount: z.coerce.number().gt(0, {
    message: 'Please enter an amount greater than $0.'
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status'
  }),
  date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export interface State {
  errors?: {
    amount?: string[]
    customerId?: string[]
    status?: string[]
  },
  message?: string | null
}

export const createInvoice = async (prevState: State, formData: FormData) => {
  const validateFields = CreateInvoice.safeParse({
    amount: formData.get('amount'),
    customerId: formData.get('customerId'),
    status: formData.get('status')
  })

  if (!validateFields.success) return {
    errors: validateFields.error.flatten().fieldErrors,
    message: 'Missing fields. Failed to create invoice'
  }

  const { amount, customerId, status } = validateFields.data
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
  } catch (error) {
    return { message: 'Database Error: Failed to create invoice' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {
  const validateFields = UpdateInvoice.safeParse({
    amount: formData.get('amount'),
    customerId: formData.get('customerId'),
    status: formData.get('status')
  })

  if (!validateFields.success) return {
    errors: validateFields.error.flatten().fieldErrors,
    message: 'Missing fields. Failed to update invoice'
  }

  const { amount, customerId, status } = validateFields.data
  const amountInCents = amount * 100

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `
  } catch (error) {
    return { message: 'Database Error: Failed to update invoice' }
  }

  revalidatePath('/dashboard/invoices')
  revalidatePath(`/dashboard/invoices/${id}/edit`)
  redirect('/dashboard/invoices')
}

export const deleteInvoice = async (id: string) => {
  throw new Error('Failed to delete invoice')

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted invoice' }
  } catch (error) {
    return { message: 'Database Error: Failed to delete invoice' }
  }
}
