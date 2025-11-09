import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShieldCheck, LogIn } from 'lucide-react'

const LoginPromptDialog = ({ open, onOpenChange, message = 'Please log in to continue.' }) => {
  const navigate = useNavigate()

  const handleLogin = () => {
    onOpenChange(false)
    navigate('/login')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10">
            <ShieldCheck className="h-6 w-6 text-[#2AA8FF]" />
          </div>
          <DialogTitle className="text-center text-[#102851]">Login Required</DialogTitle>
          <DialogDescription className="text-center text-[#5C6169]">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleLogin} className="bg-[#2AA8FF] text-white hover:bg-[#1896f0] flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LoginPromptDialog


