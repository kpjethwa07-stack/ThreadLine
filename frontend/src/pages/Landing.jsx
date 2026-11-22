
import { Link } from "react-router-dom";
import "./Landing.css";
import Brand from "../components/Brand";

function Landing() {
  return (
    <main className="landing">
      {/* HERO */}
      <section className="landing-hero">
        {/* Layered wave artwork */}
        <svg
          className="hero-waves"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="peachWave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd9a5" />
              <stop offset="100%" stopColor="#ffad83" />
            </linearGradient>
            <linearGradient id="coralWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e64d68" />
              <stop offset="55%" stopColor="#fa665c" />
              <stop offset="100%" stopColor="#f58b69" />
            </linearGradient>
            <linearGradient id="roseWave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9e355b" />
              <stop offset="100%" stopColor="#642b55" />
            </linearGradient>
            <linearGradient id="darkWave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#402448" />
              <stop offset="55%" stopColor="#281d42" />
              <stop offset="100%" stopColor="#171b3b" />
            </linearGradient>
          </defs>

          <rect width="1440" height="900" fill="url(#peachWave)" />

          {/* Top flowing ribbons */}
          <path
            d="M0 0H1440V95C1250 155 1110 170 930 135C700 90 520 55 320 95C180 122 75 105 0 75Z"
            fill="#ffc18e"
          />
          <path
            d="M0 48C170 5 290 45 470 95C690 158 850 190 1050 150C1230 115 1340 70 1440 25V205C1290 255 1130 275 950 245C720 205 580 145 390 160C210 175 95 145 0 115Z"
            fill="#f28c78"
          />
          <path
            d="M0 105C170 160 280 175 440 190C650 210 810 275 1010 250C1200 225 1320 170 1440 115V300C1290 355 1135 385 950 360C760 335 600 265 410 260C235 255 105 220 0 185Z"
            fill="url(#coralWave)"
          />
          <path
            d="M0 185C160 235 280 270 440 275C640 280 790 350 970 365C1160 380 1310 325 1440 265V390C1290 450 1150 470 970 455C760 435 620 365 420 350C240 335 110 305 0 270Z"
            fill="#d94c67"
          />

          {/* Central dark flowing area */}
          <path
            d="M0 265C145 315 235 350 345 420C465 500 550 545 700 520C865 492 965 405 1110 395C1250 385 1350 420 1440 465V690C1290 645 1190 615 1060 630C900 650 800 735 635 770C450 810 285 755 155 710C90 688 40 680 0 665Z"
            fill="url(#roseWave)"
          />
          <path
            d="M0 300C150 350 230 390 340 465C470 550 560 585 700 560C860 530 970 445 1110 435C1245 425 1350 455 1440 500V660C1300 620 1195 585 1060 600C900 620 790 705 635 735C460 770 300 725 165 680C90 655 40 650 0 635Z"
            fill="url(#darkWave)"
          />

          {/* Lower ribbons */}
          <path
            d="M0 635C130 680 240 740 380 745C560 750 700 665 855 635C1050 598 1190 620 1440 700V790C1230 715 1080 700 920 735C740 775 600 850 405 855C230 860 100 790 0 750Z"
            fill="#a43b60"
          />
          <path
            d="M0 720C140 775 245 820 390 810C570 795 720 715 890 690C1090 660 1240 710 1440 775V900H0Z"
            fill="url(#coralWave)"
          />
          <path
            d="M0 805C150 850 255 875 410 850C610 820 750 755 930 745C1130 735 1290 790 1440 840V900H0Z"
            fill="#f78370"
          />
        </svg>

        {/* Navigation */}
        
<nav className="landing-nav">
 <Link to="/" className="landing-logo">
  <Brand />
</Link>

  <div
    className="landing-nav-center"
    style={{
      padding: "12px 22px",
      borderRadius: "30px",
      background: "rgba(255,250,247,0.55)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    }}
  >
    <a href="#features" style={{ color: "#402448" }}>Features</a>
    <a href="#about" style={{ color: "#402448" }}>About</a>
  </div>

  <div className="landing-nav-right">
    <Link to="/register" className="nav-register">
      Get started <span>↗</span>
    </Link>
  </div>
</nav>


        {/* Hero content */}
        <div className="hero-content" id="home">
          <span className="hero-eyebrow">
  PROJECTS · ISSUES · TEAMWORK
</span>


          <h1>
            Bring your <br/>
            work
            <br />
            <span style={{ color: "#c41c43e7" }}>into the flow.</span>
          </h1>

          <p className="hero-description">
            A clearer way to manage projects, track issues,
            and keep your team moving together.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-button hero-button-primary">
              Try ThreadLine <span>↗</span>
            </Link>

            <a href="#features" className="hero-button hero-button-secondary">
              Explore features <span>↓</span>
            </a>
          </div>
        </div>

      </section>

      {/* INTRO STRIP */}
      <section className="landing-strip">
        <div className="strip-item">
          <span>01</span>
          <h3>Organize</h3>
          <p>Keep every project structured.</p>
        </div>
        <div className="strip-item">
          <span>02</span>
          <h3>Track</h3>
          <p>Know what needs attention.</p>
        </div>
        <div className="strip-item">
          <span>03</span>
          <h3>Collaborate</h3>
          <p>Keep your team connected.</p>
        </div>
        <div className="strip-item">
          <span>04</span>
          <h3>Deliver</h3>
          <p>Move work towards done.</p>
        </div>
      </section>


{/* FEATURES */}
<section
  className="landing-features"
  id="features"
  style={{
    padding: "110px 9% 120px",
    background: "#fffaf7",
  }}
>
  <div
    className="section-heading"
    style={{ maxWidth: "850px" }}
  >
    <span
      className="section-eyebrow"
      style={{
        fontSize: "70px",
        letterSpacing: "2.5px",
        fontWeight: 800,
        
      }}
    >
      WHAT YOU CAN DO
    </span>

    <h2
      style={{
        fontSize: "clamp(52px, 5.5vw, 60px)",
        lineHeight: 1.05,
        letterSpacing: "-2.5px",
        margin: "15px 0 24px",
        fontWeight: 700,
        color: "#59294f",
        fontFamily: "'Playfair Display', serif",
      }}
    >
      Less chasing.
      <br />
      <span style={{ color: "#f45e5b" }}>More doing.</span>
    </h2>

    <p
      style={{
        maxWidth: "650px",
        fontSize: "18px",
        lineHeight: 1.8,
        color: "#806e75",
      }}
    >
      Everything your team needs to stay on top of work,
      without losing sight of what matters.
    </p>
  </div>

  <div className="feature-grid">
    <article className="feature-card">
      <span className="feature-index">01 / PROJECTS</span>
      <div className="feature-symbol">▤</div>

      <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>
        Projects, organized.
      </h3>

      <p style={{ fontSize: "17px", lineHeight: 1.8 }}>
        Create projects, bring members together, and
        keep your work in one place.
      </p>
    </article>

    <article className="feature-card feature-card-highlight">
      <span className="feature-index">02 / ISSUES</span>
      <div className="feature-symbol">↗</div>

      <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>
        Issues, under control.
      </h3>

      <p style={{ fontSize: "17px", lineHeight: 1.8 }}>
        Assign owners, set priorities, and follow
        every issue through to completion.
      </p>
    </article>

    <article className="feature-card">
      <span className="feature-index">03 / ACTIVITY</span>
      <div className="feature-symbol">↻</div>

      <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>
        Always in the loop.
      </h3>

      <p style={{ fontSize: "17px", lineHeight: 1.8 }}>
        Follow updates and status changes so your
        team knows what is happening.
      </p>
    </article>
  </div>
</section>


      {/* WORKFLOW */}
      <section className="landing-workflow" id="workflow">
        <span className="section-eyebrow" style={{
        fontSize: "60px"}}>A SIMPLE WORKFLOW</span>
        <h2>
          From first issue
          <br />
          <span>to final delivery.</span>
        </h2>

        <div className="workflow-steps">
          <div>
            <span style={{
        fontSize: "20px"}}>01</span>
            <h3 style={{
        fontSize: "30px"}}>Create</h3>
            <p style={{
        fontSize: "20px"}}>Start a project and bring your work together.</p>
          </div>
          <div>
            <span style={{
        fontSize: "20px"}}>02</span>
            <h3 style={{
        fontSize: "30px"}}>Assign</h3>
            <p style={{
        fontSize: "20px"}}>Give every issue a clear owner and priority.</p>
          </div>
          <div>
            <span style={{
        fontSize: "20px"}}>03</span>
            <h3 style={{
        fontSize: "30px"}}>Resolve</h3>
            <p style={{
        fontSize: "20px"}}>Track progress until the work is complete.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="landing-about" id="about">
        <span className="section-eyebrow">MADE FOR BUILDERS</span>
        <h2>
          Good work happens
          <br />
          when teams <span>move together.</span>
        </h2>
        <p>
          ThreadLine brings projects, issues, and people
          together in one focused workspace.
        </p>
        <Link to="/register" className="about-button">
          Start with ThreadLine <span>↗</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <Brand className="footer-brand" />

        <p>Projects in motion. Issues under control.</p>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <Link to="/register">Get started</Link>
        </div>

        <span className="footer-copy">© 2026 ThreadLine</span>
      </footer>
    </main>
  );
}

export default Landing;
