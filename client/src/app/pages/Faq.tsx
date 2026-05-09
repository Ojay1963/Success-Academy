import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { campusImages } from "../content/site";

const faqs = [
  {
    question: "How do we start the admissions process?",
    answer:
      "Begin on the admissions page, submit the application form, and the admissions team will follow up with next-step guidance and placement support.",
  },
  {
    question: "Can parents visit before applying?",
    answer:
      "Yes. Families are encouraged to book a visit so they can see the campus, ask questions, and understand the learning environment before making a decision.",
  },
  {
    question: "Does the school serve nursery, primary, and secondary learners?",
    answer:
      "Yes. Success Academy provides dedicated pathways for nursery, primary, and secondary education with age-appropriate academic and pastoral support.",
  },
  {
    question: "Which contact option is fastest?",
    answer:
      "Phone and WhatsApp are usually the quickest options for immediate support, while the contact form is ideal for detailed enquiries.",
  },
];

export default function Faq() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="FAQ"
        description="Frequently asked questions about admissions, visits, and school information at Success Academy."
        image={campusImages.library}
      />

      <PageHero
        eyebrow="Help and FAQs"
        title="Helpful answers for parents and prospective families."
        description="If you need quick guidance about admissions, visits, or school sections, the answers below cover the most common questions."
        image={campusImages.library}
        primaryAction={{ label: "Contact School", to: "/contact" }}
        secondaryAction={{ label: "View Admissions", to: "/admissions" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-4">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
            >
              <h2 className="text-2xl font-semibold">{faq.question}</h2>
              <p className="mt-3 text-base leading-8 text-[var(--brand-muted)]">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
