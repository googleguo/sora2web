import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TextToVideoForm } from "@/components/text-to-video-form"
import { ImageToVideoForm } from "@/components/image-to-video-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <main className="min-h-screen">
      <Header dict={dict} />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              {dict.Generate?.title || "Generate Your Video"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {dict.Generate?.subtitle || "Choose your preferred method to create stunning AI-powered videos"}
            </p>
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 lg:mb-8">
              <TabsTrigger value="text" className="text-base sm:text-lg py-2.5 sm:py-3">
                {dict.Generate?.textToVideo || "Text to Video"}
              </TabsTrigger>
              <TabsTrigger value="image" className="text-base sm:text-lg py-2.5 sm:py-3">
                {dict.Generate?.imageToVideo || "Image to Video"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-0">
              <TextToVideoForm />
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <ImageToVideoForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer dict={dict} />
    </main>
  )
}
