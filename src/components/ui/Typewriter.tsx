import { HTMLMotionProps, motion, Variants } from 'framer-motion'
import React from 'react'

// Define the variants with explicit types for better type checking and autocompletion
export const sentenceVariants: Variants = {
  hidden: { opacity: 0 }, // It's good practice to have a starting opacity for the sentence container
  visible: {
    opacity: 1,
    transition: {
      // Adjust staggerChildren to speed up or slow down the typing animation.
      staggerChildren: 0.04, // Default was 0.1, made it a bit faster as an example
      delayChildren: 0.1, // Optional: add a small delay before children start animating
    },
  },
}

export const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10, // Optional: add a slight upward animation for each letter
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      // Duration for each letter's appearance.
      // Setting opacity duration to 0 was in the original, which makes letters appear instantly once staggered.
      // If you want a fade-in effect per letter, increase this duration.
      duration: 0.2, // Example: slight fade-in and move-up duration
      opacity: { duration: 0.2 }, // Keep if you want separate control, or remove if main duration handles it
    },
  },
}

// Define the props for the Typewriter component
interface TypewriterProps extends HTMLMotionProps<'p'> {
  text: string
  className?: string // Allow className to be passed for styling the motion.p
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, className, ...rest }) => {
  // Ensure text is a string, provide a fallback if necessary or handle error
  if (typeof text !== 'string') {
    // console.error("Typewriter component expects 'text' prop to be a string.");
    return null // Or return a default message, or an empty fragment
  }

  const letters = text.split('')

  return (
    <motion.p
      key={text} // Re-trigger animation when text changes
      className={className} // Apply any passed className
      variants={sentenceVariants}
      initial="hidden"
      animate="visible"
      {...rest} // Spread any other HTML attributes or motion props
    >
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`} // Unique key for each letter
          variants={letterVariants}
          // No need for individual initial/animate here as they inherit from parent by default
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  )
}
