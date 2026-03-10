import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  console.log('--- SESSION DEBUG ---')
  console.log('User Role:', (session?.user as any)?.role)
  console.log('Has Session:', !!session)
  console.log('---------------------')

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="admin-content-container min-h-screen flex bg-white">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
