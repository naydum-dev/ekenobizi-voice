import { Link } from "react-router-dom";
import aboutHero from "../assets/about-hero.jpeg";
import {
  FaHome,
  FaTree,
  FaPeopleCarry,
  FaSeedling,
  FaWater,
} from "react-icons/fa";

function animate(delay) {
  return {
    animation: `slideUp 700ms ease-out both`,
    animationDelay: `${delay}ms`,
  };
}

const villages = [
  { name: "Dikeukwu", icon: <FaHome className="text-primary text-2xl" /> },
  { name: "Dikenta", icon: <FaTree className="text-accent text-2xl" /> },
  {
    name: "Umunobiukwu",
    icon: <FaPeopleCarry className="text-primary text-2xl" />,
  },
  { name: "Umuzam", icon: <FaSeedling className="text-accent text-2xl" /> },
  { name: "Azumiri", icon: <FaWater className="text-primary text-2xl" /> },
];
const pillars = [
  {
    title: "Inform",
    color: "bg-primary",
    description:
      "Cut through rumour and noise. Every story published here is rooted in community truth — verified, local, and relevant to the people of Ekenobizi.",
  },
  {
    title: "Connect",
    color: "bg-accent",
    description:
      "Whether you live in Dikeukwu or in the diaspora, this platform keeps you woven into the life of the community you call home.",
  },
  {
    title: "Preserve",
    color: "bg-charcoal",
    description:
      "Our culture, our history, our landmarks — documented here for the generations that come after us. Ekenobizi's story deserves to be told by Ekenobizi people.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── HERO ── */}
      <section
        className="relative text-white py-24 px-6 overflow-hidden min-h-[500px] flex items-center"
        style={{
          backgroundImage: `url(${aboutHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Accent bar */}
        <div
          className="absolute top-0 left-0 w-full h-1 z-10"
          style={{
            background: "linear-gradient(to right, #942023, #769c61, #942023)",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Decorative circle */}
        <div
          className="absolute right-[-80px] top-[-80px] w-96 h-96 rounded-full opacity-10"
          style={{ background: "#769c61" }}
        />
        <div
          className="absolute left-[-60px] bottom-[-60px] w-72 h-72 rounded-full opacity-10"
          style={{ background: "#942023" }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <div style={animate(0)}>
            <span className="inline-block bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Umuopara · Umuahia South · Abia State
            </span>
          </div>

          <div style={animate(150)}>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              About <span className="text-accent">Ekenobizi Voice</span>
            </h1>
          </div>

          <div style={animate(300)}>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              A community platform built to amplify authentic voices, preserve
              our heritage, and keep every son and daughter of Ekenobizi —
              wherever they are — connected to home.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
              Our Roots
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-charcoal mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ekenobizi is an autonomous community nestled within Umuopara — one
              of the seven village communities of the Umuopara clan in Umuahia
              South Local Government Area of Abia State, Nigeria.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Umuopara itself is widely regarded as the cradle of Umuahia
              civilisation, sitting on the western border where Abia meets Imo
              State along the Imo River. Ekenobizi carries that same proud
              heritage — a community with deep roots, living traditions, and a
              people who know where they come from.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our community is made up of five villages, each with its own
              identity, yet bound together by shared ancestry, culture, and a
              common future.
            </p>
          </div>

          {/* Villages */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-5">
              The Five Villages
            </p>
            <div className="space-y-3">
              {villages.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors duration-200"
                >
                  <span>{v.icon}</span>
                  <span
                    className="font-semibold text-charcoal text-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {v.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
              Why We Exist
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-charcoal"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl overflow-hidden shadow-sm"
              >
                <div className={`${p.color} px-6 py-4`}>
                  <h3
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {p.title}
                  </h3>
                </div>
                <div className="bg-cream px-6 py-5">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
            How It Started
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-charcoal"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Story
          </h2>
        </div>

        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-5 text-base">
          <p>
            Ekenobizi Voice was born from a simple but urgent need — a reliable
            place where news, stories, and conversations about our community
            could live. Not on scattered WhatsApp groups. Not through hearsay.
            Here, in one place, built for us.
          </p>
          <p>
            Too often, communities like ours go undocumented. Events pass
            without record. Achievements go uncelebrated. Decisions get made
            without the wider community even knowing. This platform exists to
            change that — to give Ekenobizi a permanent, public voice.
          </p>
          <p>
            For those at home, it is a daily connection to what is happening
            around them. For those in the diaspora — in Lagos, Abuja, London,
            Houston, or anywhere else the sons and daughters of Ekenobizi have
            settled — it is a lifeline back to the community they carry in their
            hearts.
          </p>
          <p>
            Ekenobizi Voice is a community project. It is independent, honest,
            and built with pride. As the community grows — and as we look
            forward to new leadership with the eventual installation of our Eze
            — this platform will be here, ready to document every chapter of our
            story.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Be part of the community
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Register to join the conversation, share your stories, and stay
            connected to everything happening in Ekenobizi — wherever you are in
            the world.
          </p>
          <Link
            to="/register"
            className="bg-accent hover:bg-green-700 text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 hover:scale-105 inline-block"
          >
            Join the Community
          </Link>
        </div>
      </section>
    </main>
  );
}
