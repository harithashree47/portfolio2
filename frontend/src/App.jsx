import { useEffect, useRef, useState } from 'react'
import AOS from 'aos'
import { PROJECTS, SKILLS, TECH, ROLES } from './data.js'

const CODE = `<span class="k">const</span> <span class="v">haritha</span> = {
  role: <span class="s">"Full Stack Developer"</span>,
  stack: [<span class="s">"React"</span>, <span class="s">"NestJS"</span>,
    <span class="s">"PostgreSQL"</span>],
  auth: <span class="s">"JWT + RBAC"</span>,
  apps: <span class="n">7</span>,
  openToWork: <span class="b">true</span>,
};`
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const aos = (type, delay = 0) => ({ 'data-aos': type, 'data-aos-delay': delay })

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
            <a key={id} href={'#' + id} style={{ '--i': i }} className={active === id ? 'active' : ''} onClick={close}>{name}</a>
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
          I’m a <u>{role}</u><span className="caret" /> based in Erode, India. I build fast, user-friendly
          web apps with React.js, NestJS and PostgreSQL, from clean interfaces to secure APIs, for real client businesses.
        </p>
        <div className="row">
          <a className="btn" href="#contact">Say Hello!</a>
          <a className="btn alt" href="#projects">View work</a>
          <a className="btn alt" href={RESUME} download>Download resume</a>
        </div>
        <div className="stats">
          <div><Count to={1} suffix="+ Y." /><span>experience</span></div>
          <div><Count to={7} suffix="+" /><span>apps built</span></div>
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
      <div {...aos('fade-right')}>
        <span className="pill">About me</span>
        <h2 className="sh">Building products people enjoy using.</h2>
      </div>
      <div {...aos('fade-left', 100)}>
        <p>With over a year of experience, I develop and maintain full-stack web applications for live clients. I design JWT-secured REST APIs, integrate services like WhatsApp Business API and Google Maps, and create reusable, responsive interfaces.</p>
        <p>I work well in Agile teams and have resolved 20+ production issues with an 88% on-time delivery rate.</p>
      </div>
    </div>
  </section>
)

const Skills = () => (
  <section id="skills" style={{ paddingTop: 20 }}>
    <div {...aos('fade-up')}><span className="pill">Skills</span><h2 className="sh">What I work with</h2></div>
    <div className="skills">
      {SKILLS.map(([icon, title, list], i) => (
        <div className="card" key={title} {...aos('fade-up', i * 100)}>
          <div className="ico">{icon}</div><h3>{title}</h3><Chips list={list} />
        </div>
      ))}
    </div>
  </section>
)

function Project({ p, n }) {
  const feat = n === 0
  return (
    <div className={'cell' + (feat ? ' span2' : '')} {...aos('fade-up', feat ? 0 : (n % 2) * 100)}>
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
    <div {...aos('fade-up')}><span className="pill">Portfolio</span><h2 className="sh">Projects I’ve built</h2></div>
    <p className="note"><span aria-hidden="true">🔒</span><span>Most of these projects were built for clients and employers, so source code and live links are confidential. I’m happy to walk through any of them in an interview.</span></p>
    <div className="grid">{PROJECTS.map((p, i) => <Project key={p.t} p={p} n={i} />)}</div>
  </section>
)

const POINTS = [
  'Built and maintained 7+ full-stack apps with React.js, NestJS, PostgreSQL and Prisma ORM, supporting 3+ live client projects.',
  'Designed secure REST APIs with JWT authentication and centralized error handling across 500+ records.',
  'Created reusable, responsive UI components with React.js and Tailwind CSS, shared across all 7+ apps.',
  'Resolved 20+ production issues with 5+ senior developers, reaching 88% on-time delivery.',
  'Supported live deployment on Hostinger with an Nginx reverse proxy and PM2.',
]

const Experience = () => (
  <section id="experience">
    <div {...aos('fade-up')}><span className="pill">Experience</span><h2 className="sh">Where I’ve worked</h2></div>
    <div className="card exp" {...aos('fade-up', 100)}>
      <h3 style={{ fontSize: '1.5rem' }}>Full Stack Developer</h3>
      <p className="meta">Luisant Software Solutions, Salem · Oct 2025 to present</p>
      <ul>{POINTS.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
    <div className="edu">
      <div className="card" {...aos('fade-right')}>
        <h3>B.Tech, Information Technology</h3>
        <p className="meta">Vivekanandha College of Technology for Women, Tiruchengode<br />Aug 2019 to Mar 2023 · CGPA 8.6 / 10</p>
      </div>
      <div className="card" {...aos('fade-left', 100)}>
        <h3>MERN Stack Certification</h3>
        <p className="meta">ETS Academy, Erode · 6-month internship<br />Built the WonNet Jobs portal with JWT, role-based access and email notifications.</p>
      </div>
    </div>
  </section>
)

const Contact = () => (
  <section id="contact" style={{ paddingTop: 20 }}>
    <div className="cta" {...aos('zoom-in')}>
      <h2>Let’s work together</h2>
      <p>I’m open to full stack roles with teams that care about thoughtful, reliable products.</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <a className="btn" href="mailto:harithashree3047@gmail.com">harithashree3047@gmail.com</a>
        <a className="btn alt" href={RESUME} download>Download resume</a>
        <a className="btn alt" href="tel:8015715345">8015715345</a>
        <a className="btn alt" href="https://github.com/harithashree47" rel="noopener">GitHub</a>
        <a className="btn alt" href="https://linkedin.com/in/harithashree-gr01" rel="noopener">LinkedIn</a>
      </div>
    </div>
  </section>
)

export default function App() {
  const bar = useRef(null)
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 70, disable: () => reduce })
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
    </>
  )
}
