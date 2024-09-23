'use client'

import React, { ChangeEvent } from 'react'
import { Image } from '@nextui-org/image'

interface IAvatarImageProps {
  onImageSelected: (file: File) => void
}

const AvatarImage: React.FC<IAvatarImageProps> = ({ onImageSelected }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelected(file)
    }
  }

  return (
    <section className="w-[200px] h-[200px] rounded-full overflow-hidden relative">
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        id="avatar-input"
      />
      <label
        htmlFor="avatar-input"
        className="w-full h-full block cursor-pointer"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar"
            className="!w-full !h-full object-cover !max-w-full"
          />
        ) : (
          <section className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600">Foto do cliente</span>
          </section>
        )}
      </label>
    </section>
  )
}

export default AvatarImage
