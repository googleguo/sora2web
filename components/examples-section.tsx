import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

type ExamplesSectionProps = {
  dict: any
}

const examples = [
  {
    title: "Ocean Sunset",
    prompt: "A serene ocean sunset with waves crashing on the shore",
    thumbnail: "/ocean-sunset-waves-golden-hour.jpg",
  },
  {
    title: "City Timelapse",
    prompt: "A bustling city street at night with car lights streaking by",
    thumbnail: "/city-night-timelapse-traffic-lights.jpg",
  },
  {
    title: "Forest Morning",
    prompt: "Misty forest morning with sunlight filtering through trees",
    thumbnail: "/misty-forest-morning-sunlight.jpg",
  },
  {
    title: "Space Journey",
    prompt: "A journey through space with stars and galaxies",
    thumbnail: "/space-stars-galaxies-nebula.jpg",
  },
  {
    title: "Mountain Peak",
    prompt: "Aerial view of snow-capped mountain peaks at sunrise",
    thumbnail: "/mountain-peaks-aerial-snow-sunrise.jpg",
  },
  {
    title: "Abstract Art",
    prompt: "Colorful abstract patterns flowing and morphing",
    thumbnail: "/abstract-colorful-patterns-flowing.jpg",
  },
]

export function ExamplesSection({ dict }: ExamplesSectionProps) {
  return (
    <section id="examples" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{dict.Examples.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{dict.Examples.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Card
              key={index}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={example.thumbnail || "/placeholder.svg"}
                  alt={example.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{example.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{example.prompt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
