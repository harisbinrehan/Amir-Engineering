import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialsTable } from "@/components/admin/testimonials-table";
import { TestimonialFormDialog } from "@/components/admin/testimonial-form-dialog";
import { FaqsTable } from "@/components/admin/faqs-table";
import { FaqFormDialog } from "@/components/admin/faq-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminTestimonials, getAdminFaqs } from "@/lib/data/admin-cms";

export const metadata: Metadata = { title: "CMS" };

export default async function AdminCmsPage() {
  await requireRole(["super_admin", "admin", "content_manager"]);

  const [testimonials, faqs] = await Promise.all([getAdminTestimonials(), getAdminFaqs()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Content (CMS)</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Testimonials and FAQs shown on the public site.
        </p>
      </div>

      <Tabs defaultValue="testimonials">
        <TabsList>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-end">
            <TestimonialFormDialog />
          </div>
          <TestimonialsTable testimonials={testimonials} />
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-end">
            <FaqFormDialog />
          </div>
          <FaqsTable faqs={faqs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
