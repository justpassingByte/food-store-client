"use client"

import { X } from "lucide-react"
import { useCallback, useEffect } from 'react'

interface ModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

const Modal = ({
  title,
  isOpen,
  onClose,
  children
}: ModalProps) => {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={handleClose}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal