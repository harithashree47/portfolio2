import { useEffect, useRef, useState } from 'react'
import AOS from 'aos'
import ScrollTop from './components/ScrollTop'
import { PROJECTS, SKILLS, TECH, ROLES } from './data.js'

const CODE = `<span class="k">const</span> <span class="v">haritha</span> = {
  role: <span class="s">"Full Stack Developer"</span>,
  stack: [<span class="s">"React"</span>, <span class="s">"NestJS"</span>,
    <span class="s">"PostgreSQL"</span>],
  auth: <span class="s">"JWT + RBAC"</span>,
  projects: <span class="n">7</span>,
  deployment: ["Hostinger", "Nginx", "PM2"],
  openToWork: <span class="b">true</span>,
};`
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const aos = () => ({ 'data-aos': 'fade-up' })

function useTyped(words) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (reduce) return
    let i = 0, j = 0, del = false, timer
    const tick = () => {
      const w = words[i]
      j += del ? -1 : 1
      setText(w.slice(0, j))
      let d = del ? 40 : 85
      if (!del && j === w.length) { del = true; d = 1500 }
      else if (del && j === 0) { del = false; i = (i + 1) % words.length; d = 300 }
      timer = setTimeout(tick, d)
    }
    tick()
    return () => clearTimeout(timer)
  }, [words])
  return text
}

function Count({ to, suffix }) {
  const ref = useRef(null)
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (now) => {
        const k = Math.min((now - t0) / 1300, 1)
        setValue(Math.round(to * (1 - Math.pow(1 - k, 3))))
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <b ref={ref}>{value}{suffix}</b>
}

const Chips = ({ list }) => (
  <div className="chips">{list.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
)

const NAV = [['Home', 'home'], ['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Experience', 'experience']]
const RESUME = '/Haritha_Shree_G_Resume.pdf'

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const close = () => setOpen(false)

  useEffect(() => {
    const ids = [...NAV.map(([, id]) => id), 'contact']
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const f = () => { if (mq.matches) setOpen(false) }
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  return (
    <>
      <header>
        <div className="wrap">
          <a className="brand" href="#home" onClick={close}><span className="logo" aria-hidden="true">HS</span>Haritha</a>
          <nav className="dnav" aria-label="Sections">
            {NAV.map(([name, id]) => (
              <a key={id} href={'#' + id} className={'link' + (active === id ? ' active' : '')} aria-current={active === id ? 'true' : undefined}>{name}</a>
            ))}
            <a className="btn" href="#contact">Contact</a>
          </nav>
          <button className={'burger' + (open ? ' open' : '')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </header>
      <div className={'scrim' + (open ? ' open' : '')} onClick={close} />
      <div id="drawer" className={'drawer' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="dhead">
          <span className="brand"><span className="logo" aria-hidden="true">HS</span>Haritha Shree</span>
          <button className="dclose" aria-label="Close menu" onClick={close}>✕</button>
        </div>
        <div className="dlinks">
          {NAV.map(([name, id], i) => (
            <a key={id} href={'#' + id} style={{ '--i': i }} className={active === id ? 'active' : ''} aria-current={active === id ? 'page' : undefined} onClick={close}>{name}</a>
          ))}
        </div>
        <div className="dfoot">
          <a className="btn" href="#contact" onClick={close}>Contact me</a>
          <a className="btn alt" href={RESUME} download>Download resume</a>
        </div>
      </div>
    </>
  )
}

function Hero() {
  const role = useTyped(ROLES)
  return (
    <div className="hero" id="home">
      <div className="l">
        <h1>Hello, I’m<br />Haritha Shree G</h1>
       <p>
  I’m a <u>{role}</u><span className="caret" /> from Erode, India,
  specializing in React.js, NestJS, and PostgreSQL. I build responsive
  web applications, secure APIs, and reliable solutions for real-world
  business needs.
</p>
        <div className="row">
          <a className="btn" href="#contact">Say Hello!</a>
          <a className="btn alt" href="#projects">View work</a>
          <a className="btn alt" href={RESUME} download>Download resume</a>
        </div>
        <div className="stats">
          <div><Count to={1} suffix="+ Y." /><span>experience</span></div>
          <div><Count to={7} suffix=" +" /><span>websites &amp; apps</span></div>
          <div><Count to={3} suffix="+" /><span>live clients</span></div>
        </div>
      </div>
      <div className="portrait float">
        <div className="pic-wrap">
          <div className="code" aria-hidden="true">
            <div className="dots"><i /><i /><i /></div>
            <pre dangerouslySetInnerHTML={{ __html: CODE }} />
          </div>
        </div>
        <div className="tag a"><s />Open to work</div>
        <div className="tag b">JWT secured</div>
      </div>
    </div>
  )
}

const Marquee = () => (
  <div className="marq" aria-hidden="true">
    <div className="track">{[...TECH, ...TECH].map((x, i) => <span key={i}>{x}</span>)}</div>
  </div>
)

const About = () => (
  <section id="about">
    <div className="about">
      <div {...aos()}>
        <span className="pill">About me</span>
        <h2 className="sh">Building products people enjoy using.</h2>
      </div>
      <div>
        <p>With over a year of experience, I develop and maintain full-stack websites and apps for live clients. I design JWT-secured REST APIs, integrate services like WhatsApp Business API and Google Maps, and create reusable, responsive interfaces.</p>
        <p>I work well in Agile teams and have resolved 20+ production issues with an 88% on-time delivery rate.</p>
      </div>
    </div>
  </section>
)

const Skills = () => (
  <section id="skills" style={{ paddingTop: 20 }}>
    <div {...aos()}><span className="pill">Skills</span><h2 className="sh">What I work with</h2></div>
    <div className="skills">
      {SKILLS.map(([icon, title, list]) => (
        <div className="card" key={title}>
          <div className="ico">{icon}</div><h3>{title}</h3><Chips list={list} />
        </div>
      ))}
    </div>
  </section>
)

function Project({ p, n }) {
  const feat = n === 0
  return (
    <div className={'cell' + (feat ? ' span2' : '')}>
      <article className={'card proj' + (feat ? ' feat' : '')}>
        <div className="mock" aria-hidden="true" style={{ background: `linear-gradient(135deg,${p.g[0]}30,${p.g[1]}3d)` }}>
          <div className="win">
            <div className="dots"><i /><i /><i /></div>
            <div className="sk a" style={{ background: p.g[0] }} /><div className="sk b" /><div className="sk c" />
            <div className="blk">
              <b style={{ background: p.g[0] }} /><b style={{ background: p.g[1] }} /><b style={{ background: p.g[0] }} />
            </div>
          </div>
        </div>
        <div className="pb">
          <span className="cat">{p.c}</span>
          <h3>{p.t}</h3>
          <p>{p.d}</p>
          <Chips list={p.s} />
          <div className="imp">{p.i}</div>
          <details open={feat}>
            <summary>Key features</summary>
            <ul>{p.f.map((x) => <li key={x}>{x}</li>)}</ul>
          </details>
        </div>
      </article>
    </div>
  )
}

const Projects = () => (
  <section id="projects">
    <div {...aos()}><span className="pill">Portfolio</span><h2 className="sh">Projects I’ve built</h2></div>
    <p className="note"><span aria-hidden="true">🔒</span><span>Most of these projects were built for clients and employers, so source code and live links are confidential. I’m happy to walk through any of them in an interview.</span></p>
    <div className="grid">{PROJECTS.map((p, i) => <Project key={p.t} p={p} n={i} />)}</div>
  </section>
)

const POINTS = [
  'Built and maintained 7 + full-stack websites and apps with React.js, NestJS, PostgreSQL and Prisma ORM, supporting 3+ live client projects.',
  'Designed secure REST APIs with JWT authentication and centralized error handling across 500+ records.',
  'Created reusable, responsive UI components with React.js and Tailwind CSS, shared across all 7 + projects.',
  'Resolved 20+ production issues with 5+ senior developers, reaching 88% on-time delivery.',
  'Supported live deployment on Hostinger with an Nginx reverse proxy and PM2.',
]

const Experience = () => (
  <section id="experience">
    <div {...aos()}><span className="pill">Experience</span><h2 className="sh">Where I’ve worked</h2></div>
    <div className="card exp">
      <h3 style={{ fontSize: '1.5rem' }}>Full Stack Developer</h3>
      <p className="meta">Luisant Software Solutions, Salem · Oct 2025 - present</p>
      <ul>{POINTS.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
    <div className="edu">
      <div className="card">
        <h3>B.Tech, Information Technology</h3>
        <p className="meta">Vivekanandha College of Technology for Women, Tiruchengode<br />Aug 2019 to Mar 2023 · CGPA 8.6 / 10</p>
      </div>
      <div className="card">
        <h3>MERN Stack Certification</h3>
        <p className="meta">ETS Academy, Erode · 6-month internship<br />Built the WonNet Jobs portal with JWT, role-based access and email notifications.</p>
      </div>
    </div>
  </section>
)

const Contact = () => (
  <div id="contact" className="cta contact-section">
     
      <h2>Let’s <span className="work">work</span> together</h2>
      <p className="subtitle">I’m open to full stack roles with teams that care about thoughtful, reliable products.</p>
      <div className="row">
        <a className="btn pill email" href="mailto:harithashree3047@gmail.com" aria-label="Email">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          harithashree3047@gmail.com
          <svg className="icon arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a className="btn pill resume" href={RESUME} download aria-label="Download resume">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download resume
        </a>
        <a className="btn pill phone" href="tel:8015715345" aria-label="Phone">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          8015715345
        </a>
        <a className="btn pill github" href="https://github.com/harithashree47" rel="noopener" aria-label="GitHub">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.575.1.79-.25.79-.56v-2.08c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
          GitHub
        </a>
        <a className="btn pill linkedin" href="https://linkedin.com/in/harithashree-gr01" rel="noopener" aria-label="LinkedIn">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
     
    </div>

);

export default function App() {
  const bar = useRef(null)
  useEffect(() => {
    AOS.init({ duration: 350, once: true, mirror: false, offset: 80, easing: 'ease-out-cubic', disable: () => reduce })
    const onScroll = () => {
      const d = document.documentElement
      const k = d.scrollTop / (d.scrollHeight - d.clientHeight || 1)
      if (bar.current) bar.current.style.transform = `scaleX(${k})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <div className="progress" ref={bar} />
      <Header />
      <main className="wrap">
        <Hero /><Marquee /><About /><Skills /><Projects /><Experience /><Contact />
      </main>
      <footer>© Haritha Shree G · Erode, Tamil Nadu</footer>
      <ScrollTop />
    </>
  )
}
