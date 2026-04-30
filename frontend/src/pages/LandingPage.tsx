import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  BarChart3,
  Upload,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Wallet,
  Smartphone,
  CheckCircle2,
  Star,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-4 border-black bg-[#0e0e0e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#ddb7ff]">
              <Wallet className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-black text-white font-['Lexend'] tracking-tight">SPENDWISE</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#cfc2d6] hover:text-white hover:underline decoration-2 underline-offset-4 font-['Lexend'] font-bold uppercase transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-[#cfc2d6] hover:text-white hover:underline decoration-2 underline-offset-4 font-['Lexend'] font-bold uppercase transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-[#cfc2d6] hover:text-white hover:underline decoration-2 underline-offset-4 font-['Lexend'] font-bold uppercase transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm text-white font-['Lexend'] font-bold uppercase hover:underline decoration-2 underline-offset-4 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="neo-btn bg-[#ddb7ff] text-black hover:bg-[#4cd7f6] cursor-pointer"
                >
                  Get Started Free
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/analytics')}
                className="neo-btn bg-[#4cd7f6] text-black hover:bg-[#ddb7ff] cursor-pointer"
              >
                Go to Dashboard
              </button>
            )}
          </div>

          <button
            className="md:hidden text-white cursor-pointer border-2 border-black p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t-4 border-black bg-[#0e0e0e] px-4 py-4 space-y-3"
        >
          <a href="#features" className="block text-sm text-[#cfc2d6] hover:text-white font-['Lexend'] font-bold uppercase" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-sm text-[#cfc2d6] hover:text-white font-['Lexend'] font-bold uppercase" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#pricing" className="block text-sm text-[#cfc2d6] hover:text-white font-['Lexend'] font-bold uppercase" onClick={() => setMobileOpen(false)}>Pricing</a>
          <div className="pt-3 border-t-4 border-black flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full py-3 text-sm text-white font-['Lexend'] font-bold uppercase text-left border-2 border-black bg-[#1c1b1b] cursor-pointer">Log In</button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="w-full py-3 text-sm font-bold font-['Lexend'] uppercase text-black border-2 border-black bg-[#ddb7ff] cursor-pointer">Get Started Free</button>
              </>
            ) : (
              <button onClick={() => { navigate('/analytics'); setMobileOpen(false); }} className="w-full py-3 text-sm font-bold font-['Lexend'] uppercase text-black border-2 border-black bg-[#4cd7f6] cursor-pointer">Go to Dashboard</button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-[#131313]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(221,183,255,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(76,215,246,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(19,19,19,0.9),rgba(19,19,19,1))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-[#e2c62d] text-black text-xs font-bold font-['Lexend'] uppercase mb-6">
              <Zap className="h-4 w-4" />
              AI-Powered · Built for India
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight font-['Lexend'] uppercase">
              Stop Guessing.
              <br />
              <span className="text-[#ddb7ff]">Know Where Your</span>
              <br />
              <span className="text-[#4cd7f6]">Money Goes.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="mt-6 text-lg text-[#cfc2d6] max-w-lg mx-auto lg:mx-0 leading-relaxed font-['Public_Sans']">
              Unified expense tracking that speaks your language. Upload your bank statement and watch cryptic transactions transform into plain English — automatically.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate(isAuthenticated ? '/analytics' : '/register')}
                className="neo-btn bg-[#ddb7ff] text-black hover:bg-[#4cd7f6] flex items-center justify-center gap-2"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="neo-btn bg-[#1c1b1b] text-white hover:bg-[#353534] flex items-center justify-center gap-2"
              >
                See How It Works
              </button>
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="mt-8 flex items-center gap-4 justify-center lg:justify-start text-xs text-[#988d9f] font-['Lexend'] uppercase font-bold">
              <div className="flex -space-x-2">
                {['JK', 'PM', 'RS', 'AS'].map((initials) => (
                  <div key={initials} className="h-8 w-8 bg-[#353534] border-2 border-black flex items-center justify-center text-white text-[10px] font-bold font-['Lexend']">
                    {initials}
                  </div>
                ))}
              </div>
              <span>Trusted by <span className="text-white">12,000+</span> Indians</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="neo-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-none bg-red-500 border-2 border-black" />
                <div className="h-3 w-3 rounded-none bg-yellow-500 border-2 border-black" />
                <div className="h-3 w-3 rounded-none bg-green-500 border-2 border-black" />
                <span className="ml-2 text-xs text-[#988d9f] font-['Lexend'] uppercase">Your Transactions</span>
              </div>

              <div className="space-y-2">
                {[
                  { before: 'UPI/9876543210@okicici/SWIGGY', after: 'Swiggy food order via PhonePe', amount: '-₹423', category: 'Food & Dining', color: 'text-[#e2c62d]' },
                  { before: 'NEFT/HDFCB0XXXX1234/RENT', after: 'Monthly rent payment', amount: '-₹18,000', category: 'Housing', color: 'text-[#ddb7ff]' },
                  { before: 'IMPS/987654321@AXISB/RJAL', after: 'Money sent to Rahul Jalgaonkar', amount: '-₹5,000', category: 'Transfer', color: 'text-[#4cd7f6]' },
                  { before: 'ECS/JIO/SUB/APR26', after: 'Jio monthly recharge', amount: '-₹299', category: 'Recharge', color: 'text-[#ddb7ff]' },
                ].map((tx, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center justify-between p-3 border-2 border-black bg-[#131313] hover:bg-[#353534] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white font-['Lexend'] uppercase truncate">{tx.after}</p>
                      <p className="text-xs text-[#988d9f] font-mono mt-0.5">{tx.before.substring(0, 35)}...</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className={`text-sm font-bold font-mono ${tx.amount.startsWith('-') ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'}`}>{tx.amount}</p>
                      <p className={`text-xs ${tx.color} mt-0.5 font-['Lexend'] uppercase`}>{tx.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 border-2 border-black bg-[#e2c62d]">
                <p className="text-xs text-black text-center font-['Lexend'] uppercase font-bold">
                  AI translated 47 transactions this month · 3 new categories detected
                </p>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 border-2 border-black bg-[#ddb7ff] px-4 py-3">
              <p className="text-xs text-black font-['Lexend'] uppercase font-bold">Monthly Spend</p>
              <p className="text-2xl font-bold text-black font-mono">₹24,722</p>
              <p className="text-xs text-black flex items-center gap-1 mt-1 font-['Lexend'] font-bold">
                <TrendingUp className="h-3 w-3" /> 8% less than last month
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: Zap,
      color: 'bg-[#e2c62d] text-black border-2 border-black',
      title: 'AI-Powered Translation',
      desc: 'OpenAI transforms cryptic bank codes like "UPI/123@YBL/SWIGGY" into plain language instantly. No more guessing.',
    },
    {
      icon: Smartphone,
      color: 'bg-[#4cd7f6] text-black border-2 border-black',
      title: 'All Sources, One View',
      desc: 'HDFC, SBI, ICICI, PhonePe, Paytm, cards, wallets — every transaction unified in a single feed.',
    },
    {
      icon: BarChart3,
      color: 'bg-[#ddb7ff] text-black border-2 border-black',
      title: 'Smart Analytics',
      desc: 'See exactly where your money goes. Monthly trends, category breakdowns, and budget alerts — all in beautiful charts.',
    },
    {
      icon: Upload,
      color: 'bg-[#e2c62d] text-black border-2 border-black',
      title: 'CSV Import in Seconds',
      desc: 'Upload statements from any Indian bank — HDFC, SBI, ICICI, Axis, Kotak. Auto-detected and categorized.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#131313] border-t-4 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p custom={0} variants={fadeUp} className="text-sm font-bold text-[#e2c62d] uppercase tracking-wider mb-3 font-['Lexend']">
            Everything You Need
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white uppercase font-['Lexend']">
            Built for the Way Indians Spend
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} className="mt-4 text-lg text-[#cfc2d6] max-w-2xl mx-auto font-['Public_Sans']">
            No more spreadsheet gymnastics. Just clarity, insight, and control over every rupee.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="neo-card hover:-translate-y-1 transition-transform"
            >
              <div className={`w-14 h-14 rounded-none ${f.color} border-2 border-black flex items-center justify-center mb-4`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Lexend'] uppercase">{f.title}</h3>
              <p className="text-sm text-[#cfc2d6] leading-relaxed font-['Public_Sans']">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Your Statement',
      desc: 'Drag and drop your bank CSV or connect your account. Supports HDFC, SBI, ICICI, Axis, Kotak, and 40+ banks.',
      detail: 'Takes less than 30 seconds',
    },
    {
      num: '02',
      title: 'AI Does the Rest',
      desc: 'Our AI reads every cryptic code — UPI refs, NEFT IDs, merchant TIDs — and converts them to plain English you actually understand.',
      detail: 'Powered by GPT-4o with pattern learning',
    },
    {
      num: '03',
      title: 'Know Your Money',
      desc: 'See your spending by category, track monthly trends, set budgets, and get alerts. Beautiful charts, zero complexity.',
      detail: 'Updated in real-time',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#1c1b1b] border-t-4 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p custom={0} variants={fadeUp} className="text-sm font-bold text-[#4cd7f6] uppercase tracking-wider mb-3 font-['Lexend']">
            Three Steps. Five Minutes.
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white uppercase font-['Lexend']">
            From Cryptic to Clear
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="relative"
            >
              <div className="neo-card h-full">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl font-black text-[#ddb7ff]/60 font-['Lexend']">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Lexend'] uppercase">{step.title}</h3>
                <p className="text-[#cfc2d6] text-sm leading-relaxed mb-4 font-['Public_Sans']">{step.desc}</p>
                <p className="text-xs text-[#4cd7f6] font-bold flex items-center gap-1 font-['Lexend'] uppercase">
                  <CheckCircle2 className="h-3 w-3" />
                  {step.detail}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="h-8 w-8 text-[#353534]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TransformationSection = () => (
  <section className="py-24 bg-[#131313] border-t-4 border-black">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.p custom={0} variants={fadeUp} className="text-sm font-bold text-[#ddb7ff] uppercase tracking-wider mb-3 font-['Lexend']">
            The Problem We Solve
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white mb-6 font-['Lexend'] uppercase">
            Your Bank Statement Is Written for Banks. Not You.
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} className="text-[#cfc2d6] leading-relaxed mb-8 font-['Public_Sans']">
            Every time you check your expenses, you're decoding a machine language. "UPI/CR/987654321@YBL/AMZN" doesn't tell you that you spent ₹1,299 on Amazon via PhonePe for kitchen supplies. We fix that — permanently.
          </motion.p>

          <div className="space-y-4">
            {[
              'Handles 50+ Indian bank formats automatically',
              'Learns your merchants over time — fewer API calls',
              'Works offline once your data is imported',
              'Never stores your raw bank credentials',
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={3 + i}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 h-6 w-6 border-2 border-black bg-[#4cd7f6] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-black" />
                </div>
                <p className="text-sm text-white font-['Lexend'] uppercase font-bold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="p-5 border-2 border-black bg-[#1c1b1b]">
            <p className="text-xs font-bold text-[#ffb4ab] uppercase tracking-wider mb-3 font-['Lexend']">Before — What Your Bank Shows</p>
            <p className="text-sm font-mono text-[#988d9f] leading-relaxed">
              UPI/DR/123456789012@YBL/SWIGGY
              <br />NPCI/TXN/26XXXXXX/MUM/2026
              <br />AMT:₹523.00 CRDR:DEBIT
            </p>
          </div>

          <div className="flex justify-center">
            <div className="h-8 w-px bg-gradient-to-b from-[#ddb7ff] to-[#4cd7f6]" />
          </div>

          <div className="p-5 border-2 border-black bg-[#4cd7f6]">
            <p className="text-xs font-bold text-black uppercase tracking-wider mb-3 font-['Lexend']">After — What SpendWise Shows</p>
            <p className="text-sm font-bold text-black font-['Lexend'] uppercase">Swiggy dinner order via PhonePe</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-black font-['Lexend'] font-bold">
              <span>Food & Dining</span>
              <span>·</span>
              <span className="font-mono font-bold">-₹523</span>
              <span>·</span>
              <span>Yesterday, 8:32 PM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const StatsSection = () => {
  const stats = [
    { value: '12,000+', label: 'Active Users' },
    { value: '₹8.4Cr', label: 'Tracked This Month' },
    { value: '4.8★', label: 'Play Store Rating' },
    { value: '3 sec', label: 'Avg. Import Time' },
  ];

  return (
    <section className="py-16 border-y-4 border-black bg-[#1c1b1b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-black text-white font-mono">{s.value}</p>
              <p className="text-sm text-[#cfc2d6] mt-1 font-['Lexend'] uppercase font-bold">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const t = [
    { q: "I used to spend 20 minutes every week just figuring out what I actually bought. Now I just upload and know. Game changer for someone managing household expenses.", n: 'Priya Sharma', r: 'Marketing Manager, Mumbai', i: 'PS' },
    { q: "Freelancer life means transactions from 5 different apps. SpendWise puts it all in one place and actually tells me what it means. No more spreadsheet.", n: 'Arjun Mehta', r: 'UI Designer, Bangalore', i: 'AM' },
    { q: "Finally an expense tracker that understands Indian bank formats. HDFC, SBI, Paytm — everything just works. The AI translation is genuinely impressive.", n: 'Deepa Nair', r: 'Software Engineer, Chennai', i: 'DN' },
  ];

  return (
    <section className="py-24 bg-[#131313] border-t-4 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p custom={0} variants={fadeUp} className="text-sm font-bold text-[#ddb7ff] uppercase tracking-wider mb-3 font-['Lexend']">Real People. Real Impact</motion.p>
          <motion.h2 custom={1} variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white uppercase font-['Lexend']">Loved by Indians</motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="neo-card">
              <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-[#e2c62d] text-[#e2c62d]" />)}</div>
              <p className="text-sm text-[#cfc2d6] leading-relaxed mb-6 font-['Public_Sans']">"{item.q}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 border-2 border-black bg-[#ddb7ff] flex items-center justify-center text-black text-xs font-bold font-['Lexend']">{item.i}</div>
                <div><p className="text-sm font-bold text-white font-['Lexend'] uppercase">{item.n}</p><p className="text-xs text-[#988d9f] font-['Lexend']">{item.r}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24 bg-[#1c1b1b] border-t-4 border-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.p custom={0} variants={fadeUp} className="text-sm font-bold text-[#4cd7f6] uppercase tracking-wider mb-3 font-['Lexend']">Start Today</motion.p>
          <motion.h2 custom={1} variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white mb-6 font-['Lexend'] uppercase">Your First Plain-Language Report Is 3 Minutes Away</motion.h2>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-[#cfc2d6] mb-10 max-w-2xl mx-auto font-['Public_Sans']">Free forever for personal use. No credit card. No spam. Just clarity on your money.</motion.p>
          <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="neo-btn bg-[#ddb7ff] text-black text-base">Create Free Account <ArrowRight className="h-5 w-5 inline ml-2" /></button>
            <button onClick={() => navigate('/login')} className="neo-btn bg-[#1c1b1b] text-white text-base">I Already Have an Account</button>
          </motion.div>
          <motion.p custom={4} variants={fadeUp} className="mt-6 text-sm text-[#988d9f] flex items-center justify-center gap-2 font-['Lexend'] uppercase font-bold"><ShieldCheck className="h-4 w-4" />Bank-grade security · Data encrypted</motion.p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 bg-[#0e0e0e] border-t-4 border-black">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-[#ddb7ff]"><Wallet className="h-4 w-4 text-black" /></div>
          <span className="text-sm font-black text-white font-['Lexend'] uppercase">SpendWise</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-[#988d9f] font-['Lexend'] uppercase font-bold">
          <a href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4">Privacy</a>
          <a href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4">Terms</a>
          <a href="#" className="hover:text-white hover:underline decoration-2 underline-offset-4">Support</a>
        </div>
        <p className="text-xs text-[#4d4354] font-['Lexend']">© 2026 SpendWise. Made in India.</p>
      </div>
    </div>
  </footer>
);

export const LandingPage = () => (
  <div className="min-h-screen bg-[#131313] text-white overflow-x-hidden">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <TransformationSection />
    <StatsSection />
    <Testimonials />
    <CTASection />
    <Footer />
  </div>
);

export default LandingPage;