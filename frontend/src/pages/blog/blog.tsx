import { Link } from "react-router-dom";

export default function BlogPage() {
  const posts = [
    {
      id: "runtime-2",
      title: "Announcing Antigravity Runtime 2.0",
      description: "Today, we are releasing Antigravity Runtime 2.0. With sub-millisecond startups, a completely rewritten compilation path, and zero cold-starts out of the box.",
      date: "Jun 15, 2026",
      author: "Alan Turing",
      tag: "Runtime",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: "scheduler-architecture",
      title: "How we built the fastest edge Scheduler",
      description: "Dive deep into our queue engineering structure and cron delivery mechanisms that make the Antigravity Scheduler run reliably under massive spikes of traffic.",
      date: "May 28, 2026",
      author: "Grace Hopper",
      tag: "Engineering",
      readTime: "8 min read",
      featured: false,
    },
    {
      id: "edge-migration-guide",
      title: "Transitioning from traditional servers to edge architecture",
      description: "Learn tips and best practices for rewriting database access and stateless computing routines when migrating to global mesh execution models.",
      date: "Apr 14, 2026",
      author: "Ada Lovelace",
      tag: "Architecture",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: "securing-edge-networks",
      title: "Zero-Trust Mesh Networking with automatic mTLS",
      description: "Exploring the security challenges of service-to-service communication and how Antigravity Mesh secures transport traffic transparently.",
      date: "Mar 09, 2026",
      author: "John von Neumann",
      tag: "Security",
      readTime: "4 min read",
      featured: false,
    }
  ];

  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  return (
    <section className="relative z-10 px-6 py-28 md:py-36 max-w-[1100px] mx-auto animate-[fadeUp_0.6s_ease_both]">
      <div className="text-center md:text-left mb-16">
        <p className="eyebrow">Blog</p>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-text-custom leading-tight tracking-tight mb-5">
          Engineering & Ideas
        </h1>
        <p className="text-muted-custom text-lg max-w-[600px] leading-relaxed">
          Stay up to date with updates from the team, technical walkthroughs, and platform announcements.
        </p>
      </div>

      {featuredPost && (
        <div className="mb-12 bg-surface border border-border-custom rounded-2xl p-8 md:p-12 hover:border-indigo-custom/30 transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-indigo-custom mb-5">
              <span>{featuredPost.tag}</span>
              <span className="w-1 h-1 rounded-full bg-border-custom"></span>
              <span className="text-muted-custom font-normal">{featuredPost.readTime}</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-custom mb-4 leading-tight">
              {featuredPost.title}
            </h2>
            <p className="text-muted-custom text-base md:text-lg leading-relaxed mb-6">
              {featuredPost.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-custom to-violet-custom flex items-center justify-center font-display font-bold text-xs text-white uppercase">
                  {featuredPost.author.slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-text-custom">{featuredPost.author}</p>
                  <p className="text-[10px] md:text-xs text-muted-custom">{featuredPost.date}</p>
                </div>
              </div>
              <Link to="/blog" className="text-indigo-custom font-medium hover:opacity-80 transition-opacity">
                Read Article →
              </Link>
            </div>
          </div>
          <div className="h-64 lg:h-full bg-indigo-custom/5 border border-border-custom rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)"></div>
            <span className="font-display font-bold text-6xl text-indigo-custom/15 select-none">FEATURED</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regularPosts.map((p) => (
          <div
            key={p.id}
            className="bg-surface border border-border-custom hover:border-indigo-custom/30 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-custom font-medium uppercase tracking-wider mb-4">
                <span>{p.tag}</span>
                <span className="text-muted-custom font-normal">{p.readTime}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-text-custom mb-3 line-clamp-2 leading-snug">
                {p.title}
              </h3>
              <p className="text-muted-custom text-sm leading-relaxed mb-6 line-clamp-3">
                {p.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-custom/30">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-custom to-violet-custom flex items-center justify-center font-display font-bold text-[10px] text-white uppercase">
                  {p.author.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-semibold text-text-custom">{p.author}</p>
                  <p className="text-[8px] md:text-[10px] text-muted-custom">{p.date}</p>
                </div>
              </div>
              <Link to="/blog" className="text-indigo-custom text-xs font-medium hover:opacity-80 transition-opacity">
                Read →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
