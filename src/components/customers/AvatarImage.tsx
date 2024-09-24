'use client'

import React, { ChangeEvent } from 'react'
import { Image } from '@nextui-org/image'
import clsx from 'clsx'

interface IAvatarImageProps {
  onImageSelected: (file: File) => void
  error: string | undefined
}

const AvatarImage: React.FC<IAvatarImageProps> = ({
  onImageSelected,
  error,
}) => {
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
            removeWrapper
            src={previewUrl}
            alt="Avatar"
            className="!w-full !h-full object-cover !max-w-full"
          />
        ) : (
          <section
            className={`${error ? 'bg-rose-200' : 'bg-gray-200'} w-full h-full flex items-center justify-center`}
          >
            <section
              className={clsx(
                'flex flex-col text-gray-600 justify-center items-center',
                { 'text-red-500': error },
              )}
            >
              <span>Foto do cliente</span>
              {error && <span className="text-[9px]">Campo obrigatório</span>}
            </section>
          </section>
        )}
      </label>
    </section>
  )
}

export default AvatarImage
