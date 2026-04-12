import './admin.css'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-body min-h-screen">
      {children}
    </div>
  )
}
