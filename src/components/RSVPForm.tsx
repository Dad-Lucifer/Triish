import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Check, Heart, Utensils, Users, User } from "lucide-react";
import { toast } from "sonner";
import { saveRSVPData } from "@/firebase/exampleUsage";

interface GuestInfo {
  id: number;
  name: string;
  preference: "veg" | "nonveg" | "";
}

const RSVPForm = () => {
  const [isAttending, setIsAttending] = useState<"yes" | "no" | "">("");
  const [guestCount, setGuestCount] = useState<number | "">("");
  const [guests, setGuests] = useState<GuestInfo[]>([]);
  const [declinedName, setDeclinedName] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGuestCountChange = (value: string) => {
    if (value === "") {
      setGuestCount("");
      // Keep guests but maybe you want to clear them? Or keep state?
      // User request: "keep the entry blank".
      // Let's clear guests forms if count is cleared to avoid inconsistencies
      setGuests([]);
      return;
    }

    const count = parseInt(value);
    if (isNaN(count)) return;

    const clampedCount = Math.max(1, Math.min(10, count));
    setGuestCount(clampedCount);

    // Update guests array
    const newGuests: GuestInfo[] = [];
    for (let i = 1; i <= clampedCount; i++) {
      const existing = guests.find(g => g.id === i);
      newGuests.push(existing || { id: i, name: "", preference: "" });
    }
    setGuests(newGuests);
  };

  const handleNameChange = (guestId: number, name: string) => {
    setGuests(prev =>
      prev.map(g => g.id === guestId ? { ...g, name } : g)
    );
  };

  const handlePreferenceChange = (guestId: number, preference: "veg" | "nonveg") => {
    setGuests(prev =>
      prev.map(g => g.id === guestId ? { ...g, preference } : g)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAttending) {
      toast.error("Please select if you will be attending");
      return;
    }

    if (isAttending === "yes") {
      if (!guestCount) {
        toast.error("Please enter number of guests");
        return;
      }

      const allNamesEntered = guests.every(g => g.name.trim() !== "");
      if (!allNamesEntered) {
        toast.error("Please enter names for all guests");
        return;
      }

      const allPreferencesSelected = guests.every(g => g.preference !== "");
      if (!allPreferencesSelected) {
        toast.error("Please select food preference for all guests");
        return;
      }
    }

    if (isAttending === "no" && !declinedName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare RSVP data
      let rsvpData;
      if (isAttending === "yes") {
        rsvpData = {
          name: guests[0].name, // Main guest name
          email: "", // Could be added as an input field if needed
          guests: guestCount as number,
          attendance: true,
          guestDetails: guests,
          message: "", // Could be added as an input field if needed
          timestamp: new Date()
        };
      } else {
        // For declined responses, create a single entry with the user's name
        rsvpData = {
          name: declinedName,
          email: "",
          guests: 0, // No guests for declined response
          attendance: false,
          guestDetails: [{ id: 1, name: declinedName, preference: "" }], // Store as guest details for consistency
          message: "",
          timestamp: new Date()
        };
      }

      // Save to Firebase
      await saveRSVPData(rsvpData);

      // Show success message
      setIsSubmitted(true);
      toast.success("Thank you for your response! Your RSVP has been recorded.");
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("Sorry, there was an error submitting your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-primary" />
        </motion.div>
        <h3 className="font-display text-3xl text-primary mb-3">Thank You!</h3>
        <p className="text-muted-foreground">
          {isAttending === "yes"
            ? "We look forward to celebrating with you!"
            : "We'll miss you at the celebration!"}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Attendance Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Label className="font-display text-xl text-primary flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Will you be joining us?
        </Label>
        <RadioGroup
          value={isAttending}
          onValueChange={(value) => setIsAttending(value as "yes" | "no")}
          className="flex flex-col sm:flex-row gap-4"
        >
          <label
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${isAttending === "yes"
              ? "border-primary bg-primary/5 shadow-soft"
              : "border-border hover:border-champagne-dark"
              }`}
          >
            <RadioGroupItem value="yes" id="yes" />
            <span className="font-medium">Joyfully Accept</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${isAttending === "no"
              ? "border-primary bg-primary/5 shadow-soft"
              : "border-border hover:border-champagne-dark"
              }`}
          >
            <RadioGroupItem value="no" id="no" />
            <span className="font-medium">Regretfully Decline</span>
          </label>
        </RadioGroup>

        {isAttending === "no" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 rounded-lg bg-muted/50 border border-border space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="declined-name" className="text-sm text-muted-foreground">
                Your Name
              </Label>
              <Input
                id="declined-name"
                type="text"
                placeholder="Enter your name"
                value={declinedName}
                onChange={(e) => setDeclinedName(e.target.value)}
                className="border-2 focus:border-primary"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isAttending === "yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 overflow-hidden"
          >
            {/* Guest Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Label className="font-display text-xl text-primary flex items-center gap-2">
                <Users className="w-5 h-5" />
                Number of Guests
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={guestCount}
                  onChange={(e) => handleGuestCountChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="0"
                  className="w-24 text-center text-lg font-medium border-2 focus:border-primary no-spinner"
                />
                <span className="text-muted-foreground">
                  {guestCount === 1 ? "person" : "people"} attending
                </span>
              </div>
            </motion.div>

            {/* Guest Details */}
            {guests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Label className="font-display text-xl text-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Guest Details
                </Label>
                <div className="space-y-4">
                  {guests.map((guest, index) => (
                    <motion.div
                      key={guest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 rounded-lg bg-muted/50 border border-border space-y-4"
                    >
                      <p className="font-medium text-foreground">
                        Guest {guest.id}
                      </p>

                      {/* Guest Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`guest-name-${guest.id}`} className="text-sm text-muted-foreground">
                          Full Name
                        </Label>
                        <Input
                          id={`guest-name-${guest.id}`}
                          type="text"
                          placeholder="Enter guest name"
                          value={guest.name}
                          onChange={(e) => handleNameChange(guest.id, e.target.value)}
                          className="border-2 focus:border-primary"
                        />
                      </div>

                      {/* Food Preference */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                          <Utensils className="w-3 h-3" />
                          Food Preference
                        </Label>
                        <RadioGroup
                          value={guest.preference}
                          onValueChange={(value) => handlePreferenceChange(guest.id, value as "veg" | "nonveg")}
                          className="flex flex-wrap gap-3"
                        >
                          <label
                            className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${guest.preference === "veg"
                              ? "bg-green-100 border-2 border-green-500 text-green-700"
                              : "bg-background border-2 border-border hover:border-green-300"
                              }`}
                          >
                            <RadioGroupItem value="veg" className="sr-only" />
                            <span className="text-lg">🥬</span>
                            <span className="font-medium">Vegetarian</span>
                          </label>
                          <label
                            className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${guest.preference === "nonveg"
                              ? "bg-orange-100 border-2 border-orange-500 text-orange-700"
                              : "bg-background border-2 border-border hover:border-orange-300"
                              }`}
                          >
                            <RadioGroupItem value="nonveg" className="sr-only" />
                            <span className="text-lg">🍗</span>
                            <span className="font-medium">Non-Vegetarian</span>
                          </label>
                        </RadioGroup>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="submit"
          size="lg"
          disabled={!isAttending || isSubmitting}
          className="w-full sm:w-auto font-display text-lg tracking-wide"
        >
          {isSubmitting ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Sending...
            </motion.span>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" />
              Confirm RSVP
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default RSVPForm;
