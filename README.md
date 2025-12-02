# Carbon Tracker

A web application for tracking personal carbon footprint and environmental impact.

## Features

- Track daily carbon emissions from various activities
- Set and monitor reduction goals
- Visualize data with interactive charts
- Export reports in multiple formats
- User authentication and profile management
- Dark/light theme support

## Tech Stack

- **Frontend**: React, Chart.js, CSS3
- **Backend**: Spring Boot, H2 Database, JWT Authentication
- **Build Tools**: Maven, Vite

## Getting Started

### Prerequisites

- Node.js 16+
- Java 17+
- Maven 3.6+

### Installation

1. Clone the repository
```bash
git clone https://github.com/KrithikaRaviraj/carbon-tracker.git
cd carbon-tracker
```

2. Start the backend
```bash
cd backend
mvn spring-boot:run
```

3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

4. Open http://localhost:5173 in your browser

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
JWT_SECRET=your-secure-jwt-secret-key
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
