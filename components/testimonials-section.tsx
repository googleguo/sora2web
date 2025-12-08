import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

type TestimonialsSectionProps = {
  dict: any
}

export function TestimonialsSection({ dict }: TestimonialsSectionProps) {
  const testimonials = dict.Testimonials.items || []

  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{dict.Testimonials.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{dict.Testimonials.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial: any, index: number) => (
            <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
