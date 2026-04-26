import { FolderOpen, FileImage, FileText, File } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface AssetsTabProps {
  org: OrgWithRelations
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AssetIcon({ mimeType }: { mimeType: string | null }): React.JSX.Element {
  if (mimeType?.startsWith('image/')) return <FileImage className="h-4 w-4 text-vma-violet" aria-hidden="true" />
  if (mimeType === 'application/pdf') return <FileText className="h-4 w-4 text-vma-red" aria-hidden="true" />
  return <File className="h-4 w-4 text-vma-text-dim" aria-hidden="true" />
}

export function AssetsTab({ org }: AssetsTabProps): React.JSX.Element {
  const { assets } = org

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <FolderOpen className="h-8 w-8" />
        <p className="text-sm">No assets uploaded yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-vma-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-vma-surface border-b border-vma-border">
            <tr>
              {['Name', 'Type', 'Folder', 'Tags', 'Size', 'Uploaded'].map((h) => (
                <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr
                key={asset.id}
                className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                  i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AssetIcon mimeType={asset.mimeType} />
                    <a
                      href={asset.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-vma-text hover:text-vma-violet transition-colors"
                    >
                      {asset.name}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">{asset.mimeType ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-vma-text-muted capitalize">{asset.folder}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-vma-violet/10 text-vma-violet">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-vma-text-muted">
                  {asset.fileSize ? formatBytes(asset.fileSize) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-vma-text-muted">
                  {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
