import { Link } from "react-router-dom";

export default function PricingPage() {
  const tiers = [
    {
      name: "Sandbox",
      price: "$0",
      description: "Perfect for prototyping, side projects, and personal experiments.",
      features: [
        "100,000 requests / month",
        "1 GB Key-Value storage",
        "Shared domain routing",
        "Community support",
      ],
      cta: "Start for free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$20",
      period: "/ month",
      description: "For production applications needing high performance, scale, and custom domains.",
      features: [
        "10,000,000 requests / month",
        "25 GB Key-Value storage",
        "Custom domains with auto SSL",
        "mTLS encrypted Mesh tunnels",
        "Priority support (24h SLA)",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations requiring custom volume, dedicated hardware, and compliance.",
      features: [
        "Unlimited requests",
        "Dedicated edge compute nodes",
        "Multi-region failover routing",
        "HIPAA and SOC2 compliance",
        "24/7/365 dedicated SLA support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section className="relative z-10 px-6 py-28 md:py-36 max-w-[1100px] mx-auto animate-[fadeUp_0.6s_ease_both]">
      <div className="text-center mb-16">
        <p className="eyebrow">Pricing</p>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-text-custom leading-tight tracking-tight mb-5">
          Simple, scale-aligned pricing
        </h1>
        <p className="text-muted-custom text-lg max-w-[600px] mx-auto leading-relaxed">
          Start building for free, and only scale pricing as your users and traffic demand. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={`bg-surface border rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
              t.highlighted
                ? "border-indigo-custom shadow-[0_0_32px_rgba(123,140,255,0.15)] md:-translate-y-4"
                : "border-border-custom hover:border-indigo-custom/30"
            }`}
          >
            {t.highlighted && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-custom to-violet-custom text-white px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            
            <div>
              <h3 className="font-display font-bold text-xl text-text-custom mb-2">{t.name}</h3>
              <p className="text-muted-custom text-sm leading-relaxed mb-6">{t.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display font-bold text-4xl md:text-5xl text-text-custom">{t.price}</span>
                {t.period && <span className="text-muted-custom text-sm font-medium">{t.period}</span>}
              </div>
              
              <ul className="space-y-3.5 mb-8 list-none">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-text-custom/85 leading-normal">
                    <svg className="text-indigo-custom shrink-0 w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/pricing"
              className={`inline-flex items-center justify-center py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
                t.highlighted
                  ? "bg-gradient-to-r from-indigo-custom to-violet-custom text-white hover:opacity-90 active:scale-[0.98] shadow-[0_0_32px_rgba(123,140,255,0.25)]"
                  : "border border-border-custom hover:border-indigo-custom bg-bg/50 hover:bg-indigo-custom/5 text-text-custom"
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
