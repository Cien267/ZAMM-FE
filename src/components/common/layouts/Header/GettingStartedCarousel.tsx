import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const GUIDANCE_STEPS = [
  {
    title: "Manage Your Contacts",
    description:
      "Easily organize your leads and customers. Track every interaction and never miss a follow-up with our integrated CRM dashboard.",
    image: "https://illustrations.popsy.co/amber/customer-support.svg", // Replace with your assets
  },
  {
    title: "Track Your Deals",
    description:
      "Move opportunities through your pipeline stages. Visualizing your sales funnel has never been easier with our drag-and-drop interface.",
    image: "https://illustrations.popsy.co/amber/data-analysis.svg",
  },
  {
    title: "Powerful Analytics",
    description:
      "Gain insights into your team's performance. Generate custom reports and see your growth in real-time with beautiful charts.",
    image: "https://illustrations.popsy.co/amber/growing-business.svg",
  },
]

export function GuidanceCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <div className="w-full max-w-3xl mx-auto px-12">
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
                        className="w-full max-w-75 h-auto object-contain rounded-lg"
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
                                ? "bg-primary w-6 transition-all"
                                : "bg-muted"
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
