import { useState, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const ProfilePictureUpload = ({ userId, currentImage, onUploadComplete }) => {
  const { updateProfile } = useAuth()
  const toast = useToast()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const saveProfilePicture = useMutation(api.files.saveProfilePicture)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl()

      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!result.ok) {
        throw new Error('Upload failed')
      }

      // Convex returns the storageId as JSON: {"storageId":"..."}
      const responseData = await result.json()
      const storageId = responseData.storageId
      
      if (!storageId) {
        throw new Error('Failed to get storage ID from upload response')
      }

      // Step 3: Save profile picture URL to user
      const { url } = await saveProfilePicture({
        userId,
        storageId,
      })

      // Step 4: Update local auth context
      await updateProfile({ profileImage: url })

      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      toast.success('Profile picture uploaded', 'Your profile picture has been updated successfully')
      onUploadComplete?.(url)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed', 'Failed to upload profile picture. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return
    }

    try {
      await updateProfile({ profileImage: '' })
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.success('Profile picture removed', 'Your profile picture has been removed')
      onUploadComplete?.('')
    } catch (error) {
      console.error('Remove error:', error)
      toast.error('Remove failed', 'Failed to remove profile picture. Please try again.')
    }
  }

  const displayImage = preview || currentImage

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-[#E4EBF5]">
          <AvatarImage src={displayImage} alt="Profile" />
          <AvatarFallback className="bg-[#2AA8FF]/10 text-[#2AA8FF] text-2xl font-semibold">
            {currentImage ? '' : (userId?.charAt(0)?.toUpperCase() || 'U')}
          </AvatarFallback>
        </Avatar>
        {displayImage && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition"
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-picture-upload"
          disabled={uploading}
        />
        <label htmlFor="profile-picture-upload">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851] cursor-pointer"
            disabled={uploading}
            asChild
          >
            <span>
              <Camera className="mr-2 h-4 w-4" />
              {preview ? 'Change Picture' : 'Upload Picture'}
            </span>
          </Button>
        </label>

        {preview && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Save Picture'
            )}
          </Button>
        )}

        {preview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPreview(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            className="w-full border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
            disabled={uploading}
          >
            Cancel
          </Button>
        )}
      </div>

      <p className="text-xs text-[#5C6169] text-center">
        Recommended: Square image, max 5MB
      </p>
    </div>
  )
}

export default ProfilePictureUpload

