export default function ProposalLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0B0F] text-white">
        {children}
      </body>
    </html>
  )
}
