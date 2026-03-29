import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useSpring
} from "framer-motion";
import { useIsMobile } from "../hooks/useMobile";
import ThreeDElement from "../components/ThreeDElement";
import CursorGlow from "../components/CursorGlow";
import CustomCursor from "../components/CustomCursor";
import BackgroundCanvas from "../components/BackgroundCanvas";
import MagneticButton from "../components/MagneticButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
import { Download, Code, Github, Brain, Cloud, Mail, Phone, Linkedin, Trophy, Target, ChevronDown, Menu, X } from "lucide-react";

/**
 * Deep Black Theme with Neon Blue/Purple Gradients
 * Glassmorphism + Soft shadows + 3D Elements + Smooth animations
 * Scroll-triggered fade-in and slide-in animations
 */

interface TimelineItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Project {
  title: string;
  date: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];
  link?: string;
}

interface Skill {
  category: string;
  items: string[];
}

interface Certification {
  title: string;
  issuer: string;
  date: string;
}

interface Activity {
  title: string;
  role: string;
  period: string;
}

interface Hackathon {
  year: string;
  items: {
    title: string;
    description: string;
    isWinner?: boolean;
    isShortlisted?: boolean;
  }[];
}

// Hook to detect when element is in viewport
const useInView = (ref: React.RefObject<HTMLElement | null>) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInView;
};

const LottieIcon = ({ url, fallback: FallbackIcon }: { url: string, fallback: React.ComponentType<{ className?: string }> }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed connecting to Lottie JSON");
        return res.json();
      })
      .then(data => setAnimationData(data))
      .catch(() => setError(true));
  }, [url]);

  if (error || !animationData) {
    return <FallbackIcon className="w-8 h-8 text-accent animate-pulse" />;
  }

  return <Lottie animationData={animationData} loop={true} style={{ width: 48, height: 48 }} />;
};

const CertCard = ({ cert }: { cert: Certification }) => {
  const [flipped, setFlipped] = useState(false);

  const getSkills = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("salesforce") || t.includes("agentforce")) return "AI Agents, Salesforce CRM, Cloud";
    if (t.includes("azure") || t.includes("ai fundamentals")) return "Azure ML, AI Services, Cloud AI";
    if (t.includes("google") || t.includes("data analytics")) return "Python, Tableau, Data Storytelling";
    return "Relevant Industry Skills";
  };

  return (
    <div 
      className="relative cursor-pointer group" 
      style={{ perspective: "1000px", height: "200px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className="w-full h-full relative transition-transform duration-[0.6s]"
        style={{ 
          transformStyle: "preserve-3d", 
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 glass-card p-6 text-center shadow-lg transition-transform duration-300 flex flex-col justify-center items-center hover:border-accent/40"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-center mb-4">
            <Brain className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-2">{cert.title}</h3>
          <p className="text-muted-foreground text-sm font-medium">{cert.issuer}</p>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 glass-card p-5 text-center shadow-lg flex flex-col justify-between items-center border border-accent/20"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <p className="text-sm font-bold text-foreground">Issued by {cert.issuer}</p>
            </div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">{cert.date}</p>
          </div>
          
          <div className="bg-accent/5 px-4 py-2 rounded-xl border border-accent/10 w-full my-1">
            <p className="text-[10px] text-accent/80 font-bold uppercase tracking-widest mb-1.5 opacity-60">Key Skills</p>
            <p className="text-xs text-foreground/90 font-bold leading-tight">{getSkills(cert.title)}</p>
          </div>

          <Button variant="outline" size="sm" className="w-full h-9 text-[10px] border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-all rounded-lg font-bold uppercase tracking-widest">
            View Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Refs for sections
  const aboutRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const hackathonsRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const certificationsRef = useRef<HTMLElement | null>(null);
  const activitiesRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const contactInView = useInView(contactRef);


  const [typedText, setTypedText] = useState("");
  const subtitleText = " AI & Salesforce Developer ";

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(AI & Salesforce Developer)/g);
    return parts.map((part, i) => 
      ["AI", "&", "Salesforce Developer"].includes(part) ? (
        <span key={i} className="text-accent">{part}</span>
      ) : part
    );
  };

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setTypedText(subtitleText.substring(0, index + 1));
      index++;
      if (index === subtitleText.length) {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);


  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const timeline: TimelineItem[] = [
    {
      title: "Cloud Intern",
      company: "INFOSYS SPRINGBOARD PRAGATHI",
      period: "11/12/2025 - Present",
      description: "Gaining hands-on experience with enterprise cloud technologies. Learning cloud architecture, security basics, and scalable deployment practices.",
    },
    {
      title: "Data Analyst Intern",
      company: "B-ARM MEDICAL TECHNOLOGIES PRIVATE LIMITED",
      period: "01/12/2025 - 31/12/2025",
      description: "Analyzed e-commerce datasets for customer behavior. Data cleaning, exploratory analysis, and business insight generation.",
    },
    {
      title: "Data Analyst Intern",
      company: "CODTECH IT SOLUTIONS",
      period: "05/03/2025 - 05/04/2025",
      description: "Worked on data preprocessing, visualization, and dashboard creation using Python and Tableau to derive actionable business insights. Gained hands-on experience with PySpark and Excel.",
    },
    {
      title: "AWS Intern",
      company: "TECHSNAPIE SOLUTIONS",
      period: "01/08/2024 - 21/08/2024",
      description: "Deployed scalable applications using EC2 instances. Designed and implemented NoSQL databases with DynamoDB. Utilized Amazon S3 for secure and scalable file storage.",
    },
    {
      title: "Python Programming Intern",
      company: "Online",
      period: "08/04/2024 - 05/05/2024",
      description: "Designed and implemented interactive applications using tkinter and pygame. Built solid understanding of logic building, event handling, and modular programming.",
    },
  ];

  const TimelineCard = ({ item, index }: { item: TimelineItem; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      gsap.fromTo(cardRef.current, 
        { autoAlpha: 0, y: 80, scale: 0.95 },
        { 
          autoAlpha: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }, { scope: cardRef });

    return (
      <div
        ref={cardRef}
        className="relative group opacity-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Timeline Dot - Interactive */}
        <div
          className="absolute left-0 md:left-1/2 top-6 w-4 h-4 bg-accent rounded-full transform -translate-x-1.5 md:-translate-x-2 border-4 border-background shadow-lg transition-all duration-300 cursor-pointer"
          style={{
            boxShadow: isHovered ? "0 0 30px rgba(56, 189, 248, 0.8), 0 0 60px rgba(56, 189, 248, 0.4)" : "0 0 20px rgba(56, 189, 248, 0.6)",
            transform: isHovered ? "scale(1.5)" : "scale(1)",
          }}
        />

        {/* Animated Pulse Line from Dot */}
        <div
          className="absolute left-0 md:left-1/2 top-10 bg-gradient-to-b from-accent to-transparent pointer-events-none transition-all duration-300"
          style={{
            width: "2px",
            height: isHovered ? "40px" : "0px",
            opacity: isHovered ? 1 : 0,
            transform: "translateX(-50%)",
          }}
        />

        {/* Content */}
        <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"}`}>
          <div className="glass-card p-4 sm:p-6 md:p-8 card-3d transition-all duration-300 group-hover:border-accent/50" style={{
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            boxShadow: isHovered ? "0 0 40px rgba(124, 58, 237, 0.3)" : "0 0 20px rgba(124, 58, 237, 0.1)",
          }}>
            <h3 className="text-lg sm:text-xl font-bold text-accent mb-2 transition-all duration-300" style={{
              color: isHovered ? "#38bdf8" : "#0ea5e9",
            }}>{item.title}</h3>
            <p className="text-muted-foreground font-medium mb-2 transition-colors duration-300" style={{
              color: isHovered ? "#e2e8f0" : "#94a3b8",
            }}>{item.company}</p>
            <span className="text-sm font-semibold transition-colors duration-300" style={{
              color: isHovered ? "#38bdf8" : "#0ea5e9",
            }}>{item.period}</span>
            <p className={`text-muted-foreground leading-relaxed mt-4 transition-colors duration-300`} style={{
              color: isHovered ? "#cbd5e1" : "#94a3b8",
            }}>{item.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const projects: Project[] = [
    {
      title: "AgriMitra",
      date: "Sep 2025",
      problem: "Farmers in Kerala lacked an integrated platform for reliable crop choice, soil health, and weather forecasting.",
      solution: "AI assistant for crop recommendations, soil insights & weather updates for Kerala farmers.",
      result: "Empowered local farmers with data-driven decision-making tools.",
      tags: ["AI/ML"],
      link: "https://github.com/ssinega"
    },
    {
      title: "Smart Home Automation",
      date: "Dec 2024",
      problem: "Traditional home security systems rely on basic motion sensors prone to false alarms.",
      solution: "YOLOv8 + OpenCV human presence detection with auto-alerts & evidence storage.",
      result: "Enabled highly accurate, real-time intelligent monitoring for enhanced security.",
      tags: ["Python", "OpenCV"],
      link: "https://github.com/ssinega"
    },
    {
      title: "NeuroAdvisor AI",
      date: "Jan 2026",
      problem: "Manual analysis of brain MRIs is tedious, time-consuming, and prone to human error.",
      solution: "AI tool for brain MRI analysis, helps doctors detect abnormal regions.",
      result: "Assisted medical professionals in fast-tracking detections with improved accuracy.",
      tags: ["AI/ML"],
      link: "https://github.com/ssinega/NeuroAdvisor-AI"
    },
  ];

  const skills: Skill[] = [
    {
      category: "Programming",
      items: ["Python", "Java", "JavaScript"],
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS", "Salesforce", "Cloud Architecture"],
    },
    {
      category: "Data & Analytics",
      items: ["Data Analysis", "Excel", "SQL"],
    },
  ];

  const certifications: Certification[] = [
    {
      title: "Salesforce Certified Agentforce Specialist",
      issuer: "Salesforce",
      date: "2025",
    },
    {
      title: "Microsoft Certified Azure AI Fundamentals",
      issuer: "Microsoft",
      date: "2025",
    },
    {
      title: "Google Data Analytics",
      issuer: "Google",
      date: "2024",
    },
  ];

  const activities: Activity[] = [
    {
      title: "Oblivion'2k25",
      role: "Coordinator",
      period: "September 2025",
    },
    {
      title: "Google Student Ambassador",
      role: "Ambassador",
      period: "August 2025 - December 2025",
    },
    {
      title: "Texperia'26",
      role: "Coordinator",
      period: "March 2026",
    },
    {
      title: "Rotaract Club of Coimbatore Sparks",
      role: "Professional Service Director",
      period: "2025 - 2026",
    },
     {
      title: "Red Ribbon Cross - SNSCT",
      role: "Club Member",
      period: "2024 - Present",
    },
     {
      title: "IMUN - SNSCT",
      role: "Club Member",
      period: "2023 - 2025",
    },
  ];

  const hackathons: Hackathon[] = [
    {
      year: "2026",
      items: [
        { title: "Web Sprint", description: "Winner", isWinner: true },
        { title: "AI for Bharat", description: "Top Innovator", isWinner: true },
        { title: "Odoo x SNS", description: "Shortlisted in 1st round", isShortlisted: true },
        { title: "ET Genai hackathon", description: "Shortlisted in 1st round", isShortlisted: true },
      ],
    },
    {
      year: "2025",
      items: [
        { title: "Dev Battle", description: "Winner - Sri Shakthi Institute of Engineering and Technology", isWinner: true },
        { title: "Adobe India Hackathon", description: "Shortlisted in 1st round", isShortlisted: true },
        { title: "Flipkart Grid - 7.0", description: "Shortlisted in 1st round", isShortlisted: true },
      ],
    },
    {
      year: "2024",
      items: [
        { title: "Smart India Hackathon", description: "Participation" },
      ],
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-background text-foreground relative`}>
      <BackgroundCanvas />

      <CustomCursor />
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]"
          style={{ scaleX }}
        />
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold neon-gradient-text">
              Sine
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" style={{ animation: "statusPulse 2s infinite" }} />
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Available for opportunities</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm hover:text-accent transition-colors">About</a>
            <a href="#experience" className="text-sm hover:text-accent transition-colors">Experience</a>
            <a href="#hackathons" className="text-sm hover:text-accent transition-colors">Hackathons</a>
            <a href="#projects" className="text-sm hover:text-accent transition-colors">Projects</a>
            <a href="#skills" className="text-sm hover:text-accent transition-colors">Skills</a>
            <a href="#certifications" className="text-sm hover:text-accent transition-colors">Certifications</a>
            <a href="#activities" className="text-sm hover:text-accent transition-colors">Activities</a>
            <a href="#contact" className="text-sm hover:text-accent transition-colors">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <MagneticButton>
            <a 
              href="https://drive.google.com/uc?export=download&id=1Ri2ygg1s6v9xteySqlbq7TcxA8w9PPJp" 
              download="Sinega_Selvakumar_Resume.pdf"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button
                className="bg-accent text-accent-foreground hover:bg-sky-500 transition-all duration-300 glow-accent-sm"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </a>
          </MagneticButton>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border z-50"
              >
                <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                  <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">About</a>
                  <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Experience</a>
                  <a href="#hackathons" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Hackathons</a>
                  <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Projects</a>
                  <a href="#skills" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Skills</a>
                  <a href="#certifications" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Certifications</a>
                  <a href="#activities" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Activities</a>
                  <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-accent transition-colors py-2">Contact</a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section
        className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <ThreeDElement />
        
        {/* Aurora Atmosphere Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[600px] h-[300px] rounded-full opacity-30 blur-[120px]"
            style={{ 
              background: "rgba(99,102,241,0.12)",
              animation: "floatAurora 10s ease-in-out infinite" 
            }}
          />
          <div 
            className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
            style={{ 
              background: "rgba(56,189,248,0.08)",
              animation: "floatAurora 14s ease-in-out infinite reverse" 
            }}
          />
          <div 
            className="absolute bottom-[10%] left-[20%] w-[800px] h-[200px] rounded-full opacity-25 blur-[100px]"
            style={{ 
              background: "rgba(168,85,247,0.10)",
              animation: "floatAurora 12s ease-in-out infinite",
              animationDelay: "-2s"
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4 text-center md:text-left pointer-events-none flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight transition-colors duration-300"
            >
              Syntaxing <span className="neon-gradient-text glow-text">Success</span>, Engineering Minds, Crafting Possibilities
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.4em] bg-gradient-to-r from-white via-white/90 to-accent bg-clip-text text-transparent uppercase mb-6 font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              Sinega Selvakumar
            </motion.p>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed transition-colors duration-300 min-h-[1.5em] flex items-center pointer-events-auto"
            >
              {renderHighlightedText(typedText)}
              <span className="w-0.5 h-6 bg-accent ml-1 animate-pulse" />
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 pointer-events-auto"
            >
              {[
                { label: "SGPA", value: "8.8/10", icon: Trophy },
                { label: "Internships", value: "5 Completed", icon: Target },
                { label: "AI Projects", value: "3 Innovative", icon: Brain },
                { label: "Expertise", value: "Salesforce Certified", icon: Cloud },
              ].map((high, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 bg-accent/5 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border border-accent/20 min-w-[120px] sm:min-w-[140px]">
                  <high.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-accent/60 leading-none mb-1">{high.label}</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground leading-none truncate">{high.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto"
            >
              <MagneticButton>
                <a href="#projects">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-sky-500 glow-accent transition-all duration-300 w-full sm:w-auto"
                  >
                    Explore My Work
                  </Button>
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="#contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10 transition-all w-full sm:w-auto"
                  >
                    Get In Touch
                  </Button>
                </a>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* User Photo - Hexagonal Tech Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="relative group pointer-events-auto mt-12 md:mt-0"
          >
            {/* Orbiting Dots Container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[480px] md:h-[480px]">
                {/* Dot 1 */}
                <div 
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]"
                  style={{ animation: "orbit 8s linear infinite" }}
                />
                {/* Dot 2 */}
                <div 
                  className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-[#c084fc] shadow-[0_0_10px_#c084fc]"
                  style={{ animation: "orbit 12s linear infinite", animationDelay: "-4s" }}
                />
                {/* Dot 3 */}
                <div 
                  className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  style={{ animation: "orbit 10s linear infinite", animationDelay: "-7s" }}
                />
              </div>
            </div>

            {/* Main Photo Hexagon Container */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[180px] h-[200px] sm:w-[220px] sm:h-[250px] md:w-[320px] md:h-[360px]"
            >
              {/* Rotating Gradient Border */}
              <div 
                className="absolute inset-0 z-0 bg-gradient-to-r from-[#38bdf8] via-[#c084fc] to-[#38bdf8] opacity-60"
                style={{ 
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  animation: "spinRing 4s linear infinite"
                }}
              />
              
              {/* Inner Image Container */}
              <div 
                className="absolute inset-[4px] z-10 bg-[#020617]"
                style={{ 
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                }}
              >
                {/* Image and Background Removal Effect */}
                <div className="relative w-full h-full overflow-hidden">
                  <img 
                    src="sinega.jpg" 
                    alt="Sinega Selvakumar" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 filter saturate-[0.85] contrast-[1.1]"
                  />
                  
                  {/* Luminosity Overlay to simulated darkened edges */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-luminosity"
                    style={{ 
                      background: "radial-gradient(circle at center, transparent 40%, rgba(2, 6, 23, 0.8) 75%, #020617 100%)"
                    }}
                  />

                  {/* Top-down Edge Blend */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: "radial-gradient(circle at center, transparent 55%, #020617 85%)"
                    }}
                  />
                </div>
              </div>

              {/* Floating Badge (Pill Style) */}
              <div 
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full glass-card border-white/10 backdrop-blur-md shadow-lg flex flex-col items-center min-w-[140px] hover:scale-105 transition-transform duration-300 pointer-events-auto cursor-default"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold mb-0.5">Innovating Since</span>
                <span className="text-xs font-black text-foreground tracking-[0.1em]">2022</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Cloud Altitude Indicator (Decorative) */}
          <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4 pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-accent/60 rotate-90 mb-8 tracking-[0.2em]">UPTIME 99.99%</span>
              <div className="relative w-[2px] h-[200px] bg-accent/20 rounded-full">
                {/* Moving Marker */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-4 h-[1px] bg-accent shadow-[0_0_8px_#38bdf8]"
                  style={{ animation: "altitudeFloat 4s ease-in-out infinite alternate" }}
                >
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col whitespace-nowrap">
                    <span className="text-[10px] font-mono text-accent font-bold tracking-tighter">ALT 99.99%</span>
                    <span className="text-[8px] font-mono text-accent/40 leading-none">STABLE</span>
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-accent/60 rotate-90 mt-8 tracking-[0.2em]">LATENCY 0ms</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.3em]">scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-accent" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about"
        className="py-20 md:py-32 bg-background relative z-10 overflow-hidden"
      >
        <div 
          className="absolute -top-20 -right-20 w-96 h-96 pointer-events-none opacity-50 z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "floatOrb 8s ease-in-out infinite"
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486255172/5nVDBn5cVn5wSHgfpWghSy/abstract-glow-pattern-GBcfxhSaVsqPQ3vVSu5epz.webp"
            alt="background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="accent-line w-12" />
              <span className="text-accent text-sm font-semibold">ABOUT ME</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Passionate about building intelligent systems
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I'm Sinega Selvakumar, a Pre-Final Year CSE student with a deep passion for Salesforce, Cloud Technologies, and Data Analytics. I believe in leveraging AI and cloud computing to solve real-world problems and create meaningful impact.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My journey spans across multiple domains—from building intelligent systems with machine learning to architecting cloud solutions on AWS. I'm driven by the intersection of innovation and practical application.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceRef}
        id="experience"
        className="py-20 md:py-32 bg-card/50 relative z-10 overflow-hidden"
      >
        {/* Decorative Orbs */}
        <div 
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "floatOrb 10s ease-in-out infinite"
          }}
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "floatOrb 13s ease-in-out infinite"
          }}
          aria-hidden="true"
        />
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold">EXPERIENCE</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Professional Journey</motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent to-transparent transform md:-translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <TimelineCard 
                  key={index} 
                  item={item} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Hackathons Section */}
      <section
        ref={hackathonsRef}
        id="hackathons"
        className="py-20 md:py-32 bg-card/30 relative z-10 overflow-hidden"
      >
        <div 
          className="absolute top-10 right-10 w-64 h-64 pointer-events-none z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "pulseGlow 7s ease-in-out infinite"
          }}
          aria-hidden="true"
        />
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold uppercase">Achievements</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Hackathon Journey</motion.h2>

          <div className="space-y-16">
            {hackathons.map((yearGroup: Hackathon, yearIndex: number) => (
              <div
                key={yearIndex}
                className="relative"
              >
                <div className="flex items-center gap-6 mb-8">
                  <h3 className="text-3xl font-bold neon-gradient-text">{yearGroup.year}</h3>
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-accent/50 to-transparent" />
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {yearGroup.items.map((hack: any, hackIndex: number) => (
                    <motion.div
                      key={hackIndex}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      className={`glass-card p-6 flex flex-col items-start gap-4 card-3d group hover:border-accent/40 transition-all duration-300 ${
                        hack.isWinner ? "border-amber-500/30 bg-amber-500/5" : ""
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${
                        hack.isWinner ? "bg-amber-500/20 text-amber-500" : 
                        hack.isShortlisted ? "bg-accent/20 text-accent" : 
                        "bg-white/5 text-muted-foreground"
                      }`}>
                        {hack.isWinner ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-accent transition-colors mb-2">
                          {hack.title}
                        </h4>
                        <p className={`text-sm ${hack.isWinner ? "text-amber-500" : "text-muted-foreground"} font-medium`}>
                          {hack.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section
        ref={projectsRef}
        id="projects"
        className="py-20 md:py-32 bg-background relative z-10 overflow-hidden"
      >
        {/* Top Glowing Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{ 
            background: "linear-gradient(90deg, transparent, #38bdf8, #c084fc, transparent)",
            animation: "lineGlow 3s ease-in-out infinite"
          }}
          aria-hidden="true"
        />
        {/* Bottom Left Orb */}
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 pointer-events-none z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)"
          }}
          aria-hidden="true"
        />
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold">PROJECTS</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Featured Work</motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <Tilt 
                key={index}
                tiltMaxAngleX={isMobile ? 0 : 5} 
                tiltMaxAngleY={isMobile ? 0 : 5} 
                glareEnable={!isMobile}
                glareMaxOpacity={0.1} 
                scale={isMobile ? 1 : 1.02}
                transitionSpeed={isMobile ? 0 : 2500}
                className="h-full"
                tiltReverse={!isMobile}
              >
                <motion.div
                  variants={itemVariants}
                  layout
                  initial="collapsed"
                  whileHover="expanded"
                  className="relative group cursor-default h-full"
                >
                {/* Glowing Border effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#38bdf8] to-[#c084fc] rounded-2xl opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500" />
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#38bdf8] to-[#c084fc] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="h-full bg-card rounded-2xl p-6 flex flex-col relative z-10 border border-border group-hover:border-transparent transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-accent font-syne uppercase tracking-tight">{project.title}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{project.date}</p>
                    </div>
                    <div className="p-2.5 bg-accent/10 rounded-xl">
                      <Code className="w-5 h-5 text-accent" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-[10px] px-2.5 py-1 bg-muted/50 text-muted-foreground rounded-lg border border-border font-bold group-hover:border-accent/30 group-hover:text-accent transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.div
                    variants={{
                      collapsed: { height: 0, opacity: 0, marginTop: 0 },
                      expanded: { height: "auto", opacity: 1, marginTop: 16 }
                    }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden border-t border-border pt-0 group-hover:pt-4 transition-all"
                  >
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">01. Problem</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all">
                          &ldquo;{project.problem}&rdquo;
                        </p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">02. What I built</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                          {project.solution}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">03. Result</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-semibold">
                          {project.result}
                        </p>
                      </div>

                      <div className="pt-4">
                        <MagneticButton className="w-full">
                          <Button 
                            variant="outline" 
                            className="w-full h-10 border-accent/30 hover:border-accent hover:bg-accent/10 text-foreground gap-2 transition-all duration-300 rounded-xl text-xs font-bold"
                            asChild
                          >
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" /> View Project
                            </a>
                          </Button>
                        </MagneticButton>
                      </div>
                    </div>
                  </motion.div>

                  <div className="mt-auto pointer-events-none">
                    <motion.div
                      variants={{
                        collapsed: { opacity: 1, y: 0 },
                        expanded: { opacity: 0, y: 10 }
                      }}
                      className="flex items-center justify-center gap-2 pt-4"
                    >
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.2em]">Storytelling Mode</span>
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                    </motion.div>
                  </div>
                </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section
        ref={skillsRef}
        id="skills"
        className="py-20 md:py-32 bg-card/50 relative z-10 overflow-hidden"
      >
        <div 
          className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{ 
            backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            animation: "driftGrid 15s ease-in-out infinite alternate"
          }}
          aria-hidden="true"
        />
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold">SKILLS</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Technical Expertise</motion.h2>

          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-8 card-3d transition-all duration-700 hover:border-accent/40 group/card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-accent rounded-full transition-transform duration-500 group-hover/card:scale-y-125" />
                    <h3 className="text-xl font-bold text-accent tracking-tight">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-4 py-2 bg-muted/20 border border-border/50 text-foreground/80 rounded-xl text-sm font-semibold hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all duration-300 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Certifications Section */}
      <section
        ref={certificationsRef}
        id="certifications"
        className="py-20 md:py-32 bg-background relative z-10"
      >
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold">CERTIFICATIONS</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Professional Credentials</motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div variants={itemVariants} key={index}>
                <CertCard cert={cert} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Activities Section */}
      <section
        ref={activitiesRef}
        id="activities"
        className="py-20 md:py-32 bg-card/50 relative z-10"
      >
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold">ACTIVITIES</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Community Involvement</motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-6 flex items-start gap-4 card-3d transition-all duration-700 hover:border-accent/40"
              >
                <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
                  <Cloud className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-foreground mb-1">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{activity.role}</p>
                  <p className="text-xs text-accent font-semibold">{activity.period}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-20 md:py-32 bg-gradient-to-b from-background to-card/50 relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663486255172/5nVDBn5cVn5wSHgfpWghSy/tech-accent-pattern-JiHFANKGdM3wmqBFNmoQr4.webp"
            alt="background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
            Let's create something <span className="neon-gradient-text glow-text">meaningful</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities. Feel free to reach out!
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center">
            <MagneticButton>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-violet-600 glow-accent transition-all duration-300"
                asChild
              >
                <a href="#contact">Get In Touch</a>
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        id="contact"
        className="py-20 md:py-32 bg-background border-t border-border relative z-10 overflow-hidden"
      >
        <div 
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] pointer-events-none z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
            filter: "blur(100px)",
            animation: "pulseGlow 6s ease-in-out infinite"
          }}
          aria-hidden="true"
        />
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="accent-line w-12" />
            <span className="text-accent text-sm font-semibold">CONTACT</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16">Get In Touch</motion.h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "sinegas1652@gmail.com",
                  href: "mailto:sinegas1652@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 7603923049",
                  href: "tel:7603923049",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  value: "Connect",
                  href: "https://www.linkedin.com/in/sinegaselvakumar/",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  value: "Follow",
                  href: "https://github.com/ssinega",
                },
              ].map((contact, index) => (
                <motion.a
                  key={index}
                  variants={itemVariants}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="glass-card p-6 flex flex-col items-center text-center group hover:border-accent/50 transition-all card-3d"
                >
                  <contact.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-muted-foreground mb-2">{contact.label}</p>
                  <p className="text-foreground font-semibold text-sm break-all">
                    {contact.value}
                  </p>
                </motion.a>
              ))}
            </div>

            {/* Contact Form */}
            <motion.form variants={itemVariants} className="glass-card p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Name</label>
                <input type="text" className="bg-background/50 border border-border rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors" placeholder="Your Name" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Email</label>
                <input type="email" className="bg-background/50 border border-border rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors" placeholder="your@email.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Message</label>
                <textarea rows={4} className="bg-background/50 border border-border rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Let's build something amazing..." />
              </div>
              <MagneticButton>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-violet-600 transition-all duration-300 glow-accent-sm">
                  Send Message
                </Button>
              </MagneticButton>
            </motion.form>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Sinega Selvakumar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
