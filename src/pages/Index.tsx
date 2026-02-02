import HeroSection from "@/components/HeroSection";
import RSVPForm from "@/components/RSVPForm";
import EventDetails from "@/components/EventDetails";
import { FloralDivider, SectionTitle, HeartPattern } from "@/components/DecorativeElements";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative">
        <HeartPattern />
        
        {/* Event Details Section */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <SectionTitle 
              title="Event Details" 
              subtitle="Join us for an evening of love and celebration"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-lg mx-auto"
            >
              <EventDetails />
            </motion.div>
          </div>
        </section>

        <FloralDivider />

        {/* RSVP Section */}
        <section className="py-16 px-4 pb-24">
          <div className="container max-w-4xl mx-auto">
            <SectionTitle 
              title="RSVP" 
              subtitle="Please respond by 10th February, 2026"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto card-elegant p-6 sm:p-8 rounded-2xl"
            >
              <RSVPForm />
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center border-t border-border">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm"
          >
            With love, from the Bangera Family
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-elegant text-primary text-lg"
          >
            25 Years of Togetherness ♥ 2001 - 2026
          </motion.p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
