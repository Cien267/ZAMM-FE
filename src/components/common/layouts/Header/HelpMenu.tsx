import {
  HelpCircle,
  MessageSquare,
  Mail,
  LifeBuoy,
  Bug,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { GuidanceCarousel } from './GettingStartedCarousel'
import { Modal } from '@/components/common/modal'

const faqs = [
  {
    question: 'How do I add a new client or company?',
    answer:
      'Click the "+ Add Person" or "+ Add Company" button in the Clients page, fill in the details, and click Save.',
  },
  {
    question: 'Can I export reports?',
    answer:
      'Yes, go to Reports page and click the "Export" button. Choose PDF or Excel format.',
  },
  {
    question: 'How do I change my password?',
    answer:
      'Go to Header Settings > Profile > Security > Change Password. Enter your current password and new password.',
  },
]

export const HelpMenuContent = () => {
  const handleContactSupport = () => {
    window.location.href = 'mailto:support@zamm.com?subject=Help Request'
  }

  return (
    <>
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b px-6 gap-2">
          <TabsTrigger value="browse">Getting Started</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-0">
          <ScrollArea className="h-125">
            <GuidanceCarousel />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="faq" className="mt-0">
          <ScrollArea className="h-125">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">
                Frequently Asked Questions
              </h3>
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-medium flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                    {faq.question}
                  </div>
                  <div className="text-sm text-muted-foreground pl-6">
                    {faq.answer}
                  </div>
                  {index < faqs.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="support" className="mt-0">
          <ScrollArea className="h-125 pb-6">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Get Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is here to help you
                </p>
              </div>

              <div className="grid gap-4">
                <Button
                  className="h-auto flex-col items-start p-4 space-y-2"
                  onClick={handleContactSupport}
                >
                  <Mail className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Email Support</div>
                    <div className="text-xs opacity-90">support@zamm.com</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 space-y-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Community Forum</div>
                    <div className="text-xs text-muted-foreground">
                      Get help from other users
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 space-y-2"
                >
                  <Bug className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Report a Bug</div>
                    <div className="text-xs text-muted-foreground">
                      Help us improve the platform
                    </div>
                  </div>
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Support Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monday - Friday
                    </span>
                    <span className="font-medium">9:00 AM - 6:00 PM AEST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weekend</span>
                    <span className="font-medium">10:00 AM - 4:00 PM AEST</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <LifeBuoy className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      Need immediate help?
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Check our status page for any ongoing issues or
                      maintenance
                    </div>
                    <Button variant="link" className="h-auto p-0 text-xs">
                      View Status Page →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </>
  )
}

export const openHelpModal = () => {
  Modal.open({
    title: 'Help Center',
    description: 'Find answers, tutorials, and get support.',
    content: <HelpMenuContent />,
    className: 'max-w-6xl! max-h-[80vh]',
  })
}

export const HelpMenu = () => {
  return (
    <Button variant="ghost" size="icon" onClick={openHelpModal}>
      <HelpCircle className="h-5 w-5" />
      <span className="sr-only">Help</span>
    </Button>
  )
}
