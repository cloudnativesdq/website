/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

/* Values here trace back to the design system bound at _ds/style-guide.
   Colors resolve through the HSL triplets defined in src/app/globals.css;
   everything else references the design system's custom properties directly
   via var(), so there is exactly one place to change a value.

   Deliberately NOT overridden: the spacing scale. The design system's
   --space-1 .. --space-24 (0.25rem .. 6rem) is byte-for-byte Tailwind's own
   default scale, so p-4 / gap-6 / etc. already emit design-system values. */
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",          /* --container-pad */
      screens: {
        "2xl": "1400px",        /* --container-max */
      },
    },
    extend: {
      screens: {
        xs: "480px",
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        display: ["var(--fs-display)", { lineHeight: "var(--lh-tight)" }],
        h1: ["var(--fs-h1)", { lineHeight: "var(--lh-heading)" }],
        h2: ["var(--fs-h2)", { lineHeight: "var(--lh-heading)" }],
        h3: ["var(--fs-h3)", { lineHeight: "var(--lh-heading)" }],
        "body-lg": ["var(--fs-body-lg)", { lineHeight: "var(--lh-body)" }],
        tiny: "var(--fs-tiny)",
        micro: "var(--fs-micro)",
      },
      letterSpacing: {
        tightest: "var(--tracking-tight)",
        wider: "var(--tracking-wide)",
        widest: "var(--tracking-widest)",
      },
      colors: {
        glow: "hsl(var(--glow))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Dominican heritage accents — flag-derived colors only, used sparingly.
           Never compose these into the flag or the coat of arms. */
        heritage: {
          DEFAULT: "hsl(var(--heritage))",
          alt: "hsl(var(--heritage-2))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",     /* 0.75rem */
        md: "var(--radius-md)",     /* 1rem */
        lg: "var(--radius-lg)",     /* 1.5rem */
        xl: "var(--radius-xl)",     /* 2rem */
        "2xl": "var(--radius-2xl)", /* 2.5rem */
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "2xl": "var(--shadow-2xl)",
      },
      backdropBlur: {
        card: "12px",   /* --blur-card */
        heavy: "24px",  /* --blur-heavy */
      },
      transitionTimingFunction: {
        "out-quart": "var(--ease-out-quart)",
        "out-expo": "var(--ease-out-expo)",
      },
      transitionDuration: {
        fast: "200ms",  /* --duration-fast */
        base: "300ms",  /* --duration-base */
        slow: "500ms",  /* --duration-slow */
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
