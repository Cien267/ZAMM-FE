import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UpSertBrokerageForm } from '../components/UpSertBrokerageForm'

export const CreateBrokeragePage = () => {
  const navigate = useNavigate()

  const handleOnSubmit = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" /> Setup your Brokerage
          </CardTitle>
          <CardDescription>
            You're almost there! Create a brokerage profile to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpSertBrokerageForm onSubmit={handleOnSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateBrokeragePage
