import { useState, useRef } from 'react'
import { Upload, ImagePlus, X, RefreshCw } from 'lucide-react'

export default function ImageUploader({ onImageSelect, selectedImage, preview }) {
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    onImageSelect(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div>
      <div
        className={`drop-zone ${dragging ? 'drag-over' : ''}`}
        style={{
          padding: preview ? '12px' : '44px 24px',
          cursor: preview ? 'default' : 'pointer',
          textAlign: 'center',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !preview && fileRef.current?.click()}
      >
        {preview ? (
          <div style={{ width: '100%', position: 'relative' }}>
            <img
              src={preview}
              alt="Wound preview"
              style={{
                width: '100%',
                maxHeight: 240,
                objectFit: 'cover',
                borderRadius: 12,
                display: 'block',
              }}
            />
            {/* Overlay controls */}
            <div style={{
              position: 'absolute',
              top: 10, right: 10,
              display: 'flex', gap: 6,
            }}>
              <button
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
                title="Change image"
                style={{
                  background: 'rgba(5,11,22,0.85)',
                  border: '1px solid rgba(56,189,248,0.3)',
                  borderRadius: 8,
                  padding: '5px 8px',
                  cursor: 'pointer',
                  color: '#38bdf8',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '0.7rem',
                }}
              >
                <RefreshCw size={12} /> Change
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onImageSelect(null) }}
                title="Remove image"
                style={{
                  background: 'rgba(5,11,22,0.85)',
                  border: '1px solid rgba(248,113,113,0.3)',
                  borderRadius: 8,
                  padding: '5px 7px',
                  cursor: 'pointer',
                  color: '#f87171',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            </div>

            {/* File info strip */}
            <div style={{
              marginTop: 10,
              padding: '8px 12px',
              background: 'rgba(56,189,248,0.06)',
              border: '1px solid rgba(56,189,248,0.15)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontSize: '0.72rem',
                color: '#5d7fa3',
                fontFamily: 'JetBrains Mono, monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '70%',
              }}>
                {selectedImage?.name}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: '#38bdf8',
                fontFamily: 'JetBrains Mono, monospace',
                flexShrink: 0,
              }}>
                {formatSize(selectedImage?.size)}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              width: 60, height: 60,
              background: 'rgba(56,189,248,0.08)',
              borderRadius: 16,
              margin: '0 auto 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(56,189,248,0.2)',
            }}>
              <ImagePlus size={26} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '0.95rem', color: '#e8f0fe', fontWeight: 500, marginBottom: 6 }}>
              Drop burn image here
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5d7fa3', marginBottom: 20 }}>
              or click to browse · JPG, PNG, WEBP
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 22px',
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: 10,
                color: '#38bdf8',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              <Upload size={14} /> Browse Files
            </button>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
