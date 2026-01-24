import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const EventDetails = () => {
  const venueAddress = "Club G, Palava, Kalyan Shil Road, Dombivali East, 421204";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: "14th February, 2026",
      sublabel: "Saturday",
    },
    {
      icon: Clock,
      label: "Time",
      value: "6:30 PM",
      sublabel: "Evening Celebration",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: "Club G, Palava",
      sublabel: "Kalyan Shil Road, Dombivali East - 421204",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        {details.map((detail, index) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="p-2 rounded-full bg-primary/10">
              <detail.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {detail.label}
              </p>
              <p className="font-display text-xl text-foreground">{detail.value}</p>
              <p className="text-sm text-muted-foreground">{detail.sublabel}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto gap-2 font-medium"
          onClick={() => window.open(googleMapsUrl, "_blank")}
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EventDetails;
