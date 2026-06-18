import { Link } from "react-router-dom";

export default function ProductsPage() {
  const products = [
    {
      id: "runtime",
      title: "Runtime",
      badge: "V2.0",
      description: "A V8-based edge runtime with sub-millisecond startup. Deploy anywhere, run everywhere. Engineered for high-throughput microservices and APIs.",
      features: ["Sub-millisecond startup", "V8 sandboxing engine", "Auto-scaling to zero", "HTTP/3 and WebSockets support"],
      icon: (
        <svg className="text-indigo-custom" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: "scheduler",
      title: "Scheduler",
      badge: "Stable",
      description: "Cron jobs and background tasks with guaranteed delivery, retry logic, and full observability. Execute functions on precise intervals without managing servers.",
      features: ["Observability dashboard", "Automatic linear/exponential retry", "Cron expressions & delay queues", "Max execution limits"],
      icon: (
        <svg className="text-indigo-custom" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "store",
      title: "Store",
      badge: "Beta",
      description: "Distributed key-value and blob storage with automatic geo-replication and strong consistency. Access data with ultra-low latency from any edge node globally.",
      features: ["Auto-replication in 20+ regions", "Key-Value and Blob APIs", "Strong consistency options", "Global caching logic"],
      icon: (
        <svg className="text-indigo-custom" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: "mesh",
      title: "Mesh",
      badge: "Stable",
      description: "Service-to-service networking with mTLS, load balancing, and real-time traffic analytics. Wire your microservices safely across environments without configuration overhead.",
      features: ["mTLS automatic rotation", "Layer 7 traffic shaping", "Real-time telemetry", "Zero-trust network model"],
      icon: (
        <svg className="text-indigo-custom" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    }
  ];

  return (
    <section className="relative z-10 px-6 py-28 md:py-36 max-w-[1100px] mx-auto animate-[fadeUp_0.6s_ease_both]">
      <div className="text-center md:text-left mb-16">
        <p className="eyebrow">Suite</p>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-text-custom leading-tight tracking-tight mb-5">
          Escape traditional bounds
        </h1>
        <p className="text-muted-custom text-lg max-w-[600px] leading-relaxed">
          The Antigravity platform offers a unified suite of developer tools and infrastructure to build, scale, and connect apps at the edge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-surface border border-border-custom hover:border-indigo-custom/30 rounded-2xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-custom/10 border border-border-custom rounded-xl flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="text-xs font-semibold tracking-wider text-indigo-custom border border-indigo-custom/20 bg-indigo-custom/5 px-2.5 py-1 rounded-full uppercase">
                  {p.badge}
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl text-text-custom mb-3">{p.title}</h2>
              <p className="text-muted-custom text-sm md:text-base leading-relaxed mb-6">{p.description}</p>

              <ul className="space-y-2 mb-8 list-none">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-text-custom/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-custom"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-border-custom hover:border-indigo-custom bg-bg/50 hover:bg-indigo-custom/5 text-text-custom font-medium text-sm py-3 px-6 rounded-lg transition-all"
            >
              Get Started with {p.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
