import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
        <div className="mb-10">
          <a href="/" className="text-sm font-medium text-primary hover:underline">
            ← Back to Forge Fitness
          </a>
        </div>

        <article className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: September 10, 2026</p>
            <p className="text-muted-foreground">
              Forge Fitness is a fictional gym website and demonstration application created to
              showcase a gym lead-generation and business-automation platform.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              When you voluntarily submit information through forms on this website, we may collect
              information such as your name, phone number, email address, and other information that
              you choose to provide.
            </p>
            <p className="text-muted-foreground">
              We may also receive information associated with communications initiated through
              WhatsApp when the WhatsApp integration is enabled for the demonstration.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
            <p className="text-muted-foreground">
              Information submitted through the website may be used to respond to inquiries, follow
              up on gym membership or trial requests, demonstrate lead-management functionality, and
              operate and improve the demonstration application.
            </p>
            <p className="text-muted-foreground">
              Phone numbers may be used to demonstrate automated WhatsApp communication related to a
              submitted inquiry.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. WhatsApp</h2>
            <p className="text-muted-foreground">
              This demonstration may use WhatsApp and Meta services to send messages to users who
              have provided a phone number for communication. WhatsApp and Meta may process
              information in accordance with their respective terms and privacy policies.
            </p>
            <p className="text-muted-foreground">
              We do not use submitted phone numbers for unrelated advertising purposes through this
              demonstration.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Storage</h2>
            <p className="text-muted-foreground">
              Information submitted through the demonstration website may be transmitted to and
              stored by the application's backend services for the purpose of demonstrating
              lead-management functionality.
            </p>
            <p className="text-muted-foreground">
              We take reasonable measures to protect information processed by the application, but
              no internet transmission or storage system can be guaranteed to be completely secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Retention</h2>
            <p className="text-muted-foreground">
              Information may be retained only for as long as reasonably necessary for the purposes
              described in this policy, including operating, testing, demonstrating, and maintaining
              the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Third-Party Services</h2>
            <p className="text-muted-foreground">
              The demonstration may use third-party infrastructure and communication services,
              including hosting, database, automation, and WhatsApp/Meta services. Those providers
              may process information according to their own applicable policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Your Choices</h2>
            <p className="text-muted-foreground">
              You may choose not to submit personal information through the website. If you have
              already submitted information and would like it deleted, you may request deletion
              using the contact method provided below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Data Deletion</h2>
            <p className="text-muted-foreground">
              To request deletion of personal information submitted through this demonstration,
              contact the project owner and provide enough information to identify the submission
              you want deleted. We will review the request and delete applicable information where
              appropriate.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
            <p className="text-muted-foreground">
              This demonstration is not intended to knowingly collect personal information from
              children under the age required by applicable law without appropriate consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              This Privacy Policy may be updated when the application's functionality or data
              practices change. The updated version will be published on this page with a revised
              update date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contact</h2>
            <p className="text-muted-foreground">
              For privacy questions or requests concerning information submitted through this
              demonstration, please use the contact information provided on the Forge Fitness
              website.
            </p>
          </section>

          <footer className="border-t pt-8 text-sm text-muted-foreground">
            <p>
              Forge Fitness is a fictional demonstration project and is not a representation of an
              actual operating gym.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
