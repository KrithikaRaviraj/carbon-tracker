import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Track Your Carbon Footprint</h1>
          <p className="hero-subtitle">
            Our mission is to empower individuals to make informed decisions about their environmental impact. Track, understand, and reduce your carbon footprint with data-driven insights.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <a href="#features" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="carbon-icon">🌱</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Our Mission & Features</h2>
          <div className="mission-statement">
            <p>We believe that individual actions, when multiplied across millions of people, can create meaningful environmental change. Our platform helps you understand your carbon footprint and provides actionable insights to reduce it.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data-Driven Insights</h3>
              <p>Comprehensive analytics with charts and breakdowns to understand your environmental impact patterns</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personal Goals</h3>
              <p>Set daily and monthly carbon reduction targets and track your progress towards sustainability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Simple Tracking</h3>
              <p>Log transportation, energy use, and consumption activities with our user-friendly interface</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Make a Difference</h3>
              <p>Join a community committed to reducing environmental impact through conscious lifestyle choices</p>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account and set up your profile in minutes</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Log Activities</h3>
              <p>Record your daily activities like travel, energy use, and consumption</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Track Progress</h3>
              <p>View detailed analytics and monitor your carbon footprint over time</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Reduce Impact</h3>
              <p>Get personalized recommendations to lower your environmental impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of users who are already tracking and reducing their carbon footprint</p>
            <Link to="/login" className="btn-primary large">Start Tracking Today</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Carbon Tracker</h4>
              <p>Making sustainability accessible for everyone</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>Activity Tracking</li>
                <li>Analytics Dashboard</li>
                <li>Goal Setting</li>
                <li>Progress Reports</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Carbon Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}