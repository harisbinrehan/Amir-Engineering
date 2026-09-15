import { StarIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { getTestimonials } from "@/lib/data/home-content";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <Section variant="muted">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-industrial text-sm font-semibold tracking-wide uppercase">Testimonials</span>
        <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Trusted by Manufacturers Across the Region
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.id} className="border-border bg-card flex flex-col rounded-lg border p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  className={
                    index < (testimonial.rating ?? 0)
                      ? "fill-industrial text-industrial size-4"
                      : "text-muted-foreground/30 size-4"
                  }
                />
              ))}
            </div>
            <blockquote className="text-foreground mt-4 flex-1 text-sm leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="border-border mt-6 border-t pt-4 text-sm">
              <span className="block font-semibold">{testimonial.author_name}</span>
              <span className="text-muted-foreground">
                {testimonial.author_title}
                {testimonial.company_name ? `, ${testimonial.company_name}` : ""}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
