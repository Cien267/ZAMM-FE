import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const GUIDANCE_STEPS = [
  {
    title: 'Dashboard Overview',
    description:
      'The Dashboard provides a real-time overview of your clients, loans, and upcoming events, helping you quickly see what needs attention. It highlights key activities, shows a summary of your loan book, active loans, and clients, and visualizes how your total liabilities change over time, giving you a clear snapshot of your business performance at a glance.',
    image: '/images/getting-started/dashboard.png',
  },
  {
    title: 'Clients – People & Companies',
    description:
      'The Clients screen allows you to manage all your clients in one place, with separate tabs for People and Companies to clearly distinguish individual and business clients. You can quickly search, filter, and view key client details, assign brokers, and add new clients, making it easy to keep your client records organized and up to date.',
    image: '/images/getting-started/clients.png',
  },
  {
    title: 'Add a New Person',
    description:
      'This modal allows you to create a new individual client by capturing their personal and contact details, assigning a broker, and recording key information such as marital status and dependents. Once saved, the person can be immediately used in assets, liabilities, and other client-related workflows.',
    image: '/images/getting-started/add-person.png',
  },
  {
    title: 'Add a New Asset',
    description:
      'This modal lets you record a client’s asset by capturing property details, market value, usage, and ownership structure. You can also link existing or new liabilities to the asset, ensuring the asset can be used for loan allocation, equity calculations, and future lending analysis.',
    image: '/images/getting-started/add-asset.png',
  },
  {
    title: 'Add a New Liability',
    description:
      'This modal is used to record a client’s loan by capturing lender details, loan product, purpose, interest structure, balances, and repayment information. Once created, the liability becomes part of the client’s loan portfolio and can be linked to assets for equity and LVR calculations.',
    image: '/images/getting-started/add-liability.png',
  },
  {
    title: 'Reports Overview',
    description:
      'The Reports screen provides a consolidated view of people, companies, assets, and liabilities across your portfolio. It highlights key totals and top-performing assets and loans, helping you quickly understand portfolio composition and identify high-value items, with the ability to export reports for further analysis or sharing.',
    image: '/images/getting-started/report.png',
  },
  {
    title: 'Lenders',
    description:
      'The Lenders screen lets you manage the financial institutions you work with by selecting approved lenders and their available loan products. Only selected lenders appear when creating liabilities, helping ensure loans are recorded against the correct institutions and keeping your portfolio consistent and accurate.',
    image: '/images/getting-started/lenders.png',
  },
  {
    title: 'Staff Management',
    description:
      'The Staffs screen allows you to manage brokerage team members by viewing their details, assigning roles, and controlling system access. It helps ensure the right people have the appropriate permissions while keeping staff records organized and up to date.',
    image: '/images/getting-started/staffs.png',
  },
]

export function GuidanceCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <div className="w-full max-w-5xl mx-auto px-12">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {GUIDANCE_STEPS.map((step, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="flex flex-col md:flex-row items-center gap-8 p-6 min-h-80">
                    <div className="flex-1 w-full flex justify-center">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full max-w-full h-auto object-contain rounded-lg"
                      />
                    </div>

                    <div className="flex-1 space-y-4 text-left">
                      <h2 className="text-3xl font-bold tracking-tight text-primary">
                        {step.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      <div className="pt-4 flex gap-2">
                        {GUIDANCE_STEPS.map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i === index
                                ? 'bg-primary w-6 transition-all'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default GuidanceCarousel
