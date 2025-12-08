import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type FAQSectionProps = {
  dict: any
}

export function FAQSection({ dict }: FAQSectionProps) {
  const faqs = [
    {
      question: dict.FAQ.q1,
      answer: dict.FAQ.a1,
    },
    {
      question: dict.FAQ.q2,
      answer: dict.FAQ.a2,
    },
    {
      question: dict.FAQ.q3,
      answer: dict.FAQ.a3,
    },
    {
      question: dict.FAQ.q4,
      answer: dict.FAQ.a4,
    },
    {
      question: dict.FAQ.q5,
      answer: dict.FAQ.a5,
    },
    {
      question: dict.FAQ.q6,
      answer: dict.FAQ.a6,
    },
    {
      question: dict.FAQ.q7,
      answer: dict.FAQ.a7,
    },
    {
      question: dict.FAQ.q8,
      answer: dict.FAQ.a8,
    },
  ]

  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{dict.FAQ.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{dict.FAQ.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
