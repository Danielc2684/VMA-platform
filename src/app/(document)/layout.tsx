export default function DocumentLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-vma-bg text-vma-text">
        {children}
      </body>
    </html>
  )
}
